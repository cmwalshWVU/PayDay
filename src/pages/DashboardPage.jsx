import React, { useEffect, useState, useCallback } from 'react';
import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import './PaymentPage.scss';
import transakSDK from '@transak/transak-sdk'
import { useSelector, useDispatch } from 'react-redux';
import Firebase, { signInWithCustomToken, createAccountCollectionIfNotExists } from '../firebase';
import { setContacts, setUser, setLoadingBalances } from '../store/actions/userActions';
import { withRouter } from 'react-router';
import { erc20ContractAbi } from '../components/Erc20TokenAbi';
import { isString } from 'util';
import ContactsList from '../components/contacts/ContactsList';
import TransferModal from '../components/modals/TransferModal';
import LandingPageComponent from '../components/LandingPageComponent'
import PersonalAccountHeader from '../components/PersonalAccountHeader';
import HoldingsListCard from '../components/holdings/HoldingsListCard';
import Menu from '../components/Menu';
import { openTransak } from '../services/TransakSerice';


const DashboardPage = () => {

  const web3 = useSelector((state) => state.user.web3)
  const useDarkMode = useSelector((state) => state.user.useDarkMode)
  const accounts = useSelector((state) => state.user.accounts)

  // const [accounts, setaccounts] = useState([])
  // const [account, setAccount] = useState([])
  const [tokenToSend, setTokenToSend] = useState("ETH")
  const [open, setOpen] = useState(false)
  const [transferToAddress, setTransferToAddress] = useState("")

  const dispatch = useDispatch()

  const openModal = (open, address) => {
    setTransferToAddress(address)
    setOpen(true)
  }

  const closeModal = () => {
    setTransferToAddress("")
    setOpen(false)
  }

  let calculateHexValue = (value, decimals, BN) => {
    if (!isString(value)) {
      throw new Error('Pass strings to prevent floating point precision issues.')
    }
    const ten = new BN(10)
    const base = ten.pow(new BN(decimals))

    if (value === '.') {
      throw new Error(
      `Invalid value ${value} cannot be converted to`
      + ` base unit with ${decimals} decimals.`)
    }

    // Split it into a whole and fractional part
    let comps = value.split('.')
    if (comps.length > 2) { throw new Error('Too many decimal points'); }
  
    let whole = comps[0], fraction = comps[1];
  
    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > decimals) {
      throw new Error('Too many decimal places')
    }

    while (fraction.length < decimals) {
      fraction += '0'
    }

    whole = new BN(whole)
    fraction = new BN(fraction)
    let result = (whole.mul(base)).add(fraction)

    return web3.utils.toHex(result)
  }

  const openFortmaticTransfer = (transferAmount, fromAddress, toAddress) => {

    if (tokenToSend === "ETH") {
      const sendValue = web3.utils.toWei(transferAmount, 'ether'); // Convert 1 ether to wei

      // Construct Ether transaction params
      const txnParams = {
        from: fromAddress,
        to: toAddress,
        value: sendValue
      }
      
      // Send Ether transaction with web3
      web3.eth.sendTransaction(txnParams)
        .once('transactionHash', (hash) => { console.log(hash); })
        .once('receipt', (receipt) => { 
          closeModal()
          console.log(receipt); 
        });
    } else {
      let contractAddress = tokenToSend.address
      let erc20Contract = new web3.eth.Contract(erc20ContractAbi, contractAddress);
      erc20Contract.methods.decimals().call().then((decimals) => {
        // Calculate contract compatible value for transfer with proper decimal points using BigNumber
        let calculatedValue = calculateHexValue(transferAmount, decimals, web3.utils.BN);
        erc20Contract
            .methods
            .transfer(toAddress, calculatedValue)
            .send({ from: fromAddress }, (err, txnHash) => {
              console.log(err);
              console.log(txnHash);
              closeModal()
            })
      })
    }
  }

  if (web3) {
    return (
      <>
        <IonContent className={"ion-padding home-page"} >
          <div className="main-content">
            { web3 ?
              <>
                <PersonalAccountHeader accounts={accounts}/>
                <div className="market-cards">
                    <HoldingsListCard accounts={accounts} openTransak={openTransak} openModal={openModal}/>
                    <IonCard className={`main-card ${useDarkMode ? "light-card" : null}`}>
                      <IonCardHeader>
                        <IonCardTitle className={"accounts-title"} >
                          Contacts
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent className="contacts-content">
                        <ContactsList openModal={openModal} openTransak={openTransak} />
                      </IonCardContent>
                    </IonCard>
                  </div>
              </>
              :
              <LandingPageComponent />
            }              
          </div>
        </IonContent>

        <TransferModal  open={open}
                        setOpen={setOpen}
                        setTokenToSend={setTokenToSend}
                        tokenToSend={tokenToSend}
                        account={accounts[0]}
                        setTransferToAddress={setTransferToAddress}
                        transferToAddress={transferToAddress}
                        openFortmaticTransfer={openFortmaticTransfer} />
      </>
    );
  } else {
    return (
      <LandingPageComponent />
    )
  }
};

export default withRouter(React.memo(DashboardPage))
