import React, { useEffect, useState, useCallback } from 'react';
import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import './PaymentPage.scss';
import transakSDK from '@transak/transak-sdk'
import { useSelector, useDispatch } from 'react-redux';
import Firebase, { signInWithCustomToken, createAccountCollectionIfNotExists } from '../firebase';
import { setContacts, setUser, setLoadingBalances } from '../store/actions/userActions';
import { erc20ContractAbi } from '../components/Erc20TokenAbi';
import { isString } from 'util';
import ContactsList from '../components/contacts/ContactsList';
import TransferModal from '../components/modals/TransferModal';
import DesktopArticleList from '../components/articles/desktopArticleList';
import LandingPageComponent from '../components/LandingPageComponent'
import PersonalAccountHeader from '../components/PersonalAccountHeader';
import HoldingsListCard from '../components/holdings/HoldingsListCard';
import AccountView from '../components/account/AccountView';
import DesktopPriceList from '../components/market/DesktopPriceList';
import Menu from '../components/Menu';
import { toast } from '../components/toast';

const PaymentPage = () => {

  const web3 = useSelector((state) => state.user.web3)
  const useDarkMode = useSelector((state) => state.user.useDarkMode)
  const [selectedView, setSelectedView] = useState("dashboard")

  const [accounts, setaccounts] = useState([])
  const [account, setAccount] = useState([])
  const [balance, setBalance] = useState("0");
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

  const user = useSelector((state) => state.user.user)

  const getAccounts = useCallback(async () => {
    if (web3 && web3.eth) {
      dispatch(setLoadingBalances(true))
      web3.eth.getAccounts().then(async accounts => {
        setAccount(accounts[0])
        setaccounts(accounts)

        if (!user) {
          signInWithCustomToken(accounts[0]).then((user) => {
            toast("Sucessfully Logged In")
            createAccountCollectionIfNotExists(accounts[0])
            dispatch(setUser(user))
            // return <Redirect to="/wallet" />
          })
        }
        const amount = await web3.eth.getBalance(accounts[0])
        if (amount) {
          return setBalance(web3.utils.fromWei(amount.toString(), 'ether'))
        } else {
          return 0
        }
      })
    }
  }, [dispatch, user, web3])

  useEffect(() => {
    if (user) {
      const accounts = Firebase.firestore().collection('accounts').doc(user.uid).collection("accounts")
      accounts.onSnapshot(querySnapshot => {
          const accounts = []
          querySnapshot.docs.forEach(doc => {
              const data = doc.data()
              accounts.push(data)
          });
          dispatch(setContacts(accounts))
      }, err => {
          console.log(`Encountered error: ${err}`);
      });
    } else {
      
    }
  }, [dispatch, user, getAccounts]);
  
  const openTransak = (address) => {
    let transak = new transakSDK({
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY,  // Your API Key
        environment: 'PRODUCTION', // STAGING/PRODUCTION
        hostURL: window.location.origin,
        defaultCryptoCurrency: 'ETH',
        networks: 'ethereum',
        walletAddress: address, // Your customer's wallet address
        themeColor: '6851ff', // App theme color
        fiatCurrency: 'USD', // INR/GBP
        widgetHeight: '600px',
        widgetWidth: '400px'
    });

    transak.init();
    
    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
        console.log(data)
    });

    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (data) => {
      transak.close();
    })
    
    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log(orderData);
        transak.close();
    });
  
  }

  useEffect(() => {
    getAccounts()
  }, [web3, getAccounts])

  return (
    <IonPage>
      <div className="desktopview">
        <Menu setSelectedView={setSelectedView} selectedView={selectedView} />
          <IonContent className={"ion-padding home-page"} >
            <div className="main-content">
              { selectedView === "market" ?
                  <DesktopPriceList />
              : selectedView === "account" ?
                <AccountView />
              : selectedView === "news" ?
                <DesktopArticleList  news={[]} />
              :
              web3 ?
                <>
                  <PersonalAccountHeader  accounts={accounts} />
                  <div className="market-cards">
                      <HoldingsListCard accounts={accounts} openTransak={openTransak} openModal={openModal}/>
                      <IonCard className={`main-card ${!useDarkMode ? "light-card" : null} `}>
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
      </div>

      <TransferModal  open={open}
                      setOpen={setOpen}
                      setTokenToSend={setTokenToSend}
                      tokenToSend={tokenToSend}
                      account={account}
                      setTransferToAddress={setTransferToAddress}
                      transferToAddress={transferToAddress}
                      balance={balance}
                      openFortmaticTransfer={openFortmaticTransfer} />
    </IonPage>
  );
};

export default PaymentPage
