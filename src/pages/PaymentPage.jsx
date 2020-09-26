import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel, IonList, IonContent, IonPage, IonToolbar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSegment, IonSegmentButton, IonSearchbar } from '@ionic/react';
import './PaymentPage.scss';
import transakSDK from '@transak/transak-sdk'
import { useSelector, useDispatch } from 'react-redux';
import Firebase from '../firebase';
import { setContacts } from '../store/actions/userActions';
import { withRouter } from 'react-router';
import { ERC20TOKENS } from '../components/Erc20Tokens';
import PersonalAccountItem from '../components/contacts/personalAccountItem'
import { erc20ContractAbi } from '../components/Erc20TokenAbi';
import { isString } from 'util';
import TokenItem from '../components/market/TokenItem';
import PurchaseModal from '../components/modals/PurchaseModal';
import ContactsList from '../components/contacts/ContactsList';
import TransferModal from '../components/modals/TransferModal';

const PaymentPage = (props) => {
  const [accounts, setaccounts] = useState([])
  const [account, setAccount] = useState([])
  const [balance, setBalance] = useState("0");
  const [tokenToSend, setTokenToSend] = useState("ETH")

  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState(0);

  const fortmatic = useSelector((state) => state.user.fortmatic)

  const web3 = useSelector((state) => state.user.web3)

  const [fortmaticLoggedIn, setFortmaticLoggedIn] = useState(fortmatic ? fortmatic.user.isLoggedIn() : false)

  const [open, setOpen] = useState(false)
  const [transferToAddress, setTransferToAddress] = useState("")
  const [selectedTab, setSelectedTab] = useState("contacts")

  const [searchString, setSearchString] = useState("")

  const dispatch = useDispatch()

  const currentPrices = useSelector((state) => state.prices.currentPrices)

  const openModal = (open, address) => {
    setTransferToAddress(address)
    setOpen(true)
  }

  const closeModal = () => {
    setTransferToAddress("")
    setOpen(false)
  }

  const depositFortmatic = () => {
    fortmatic.user.deposit();
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


  useEffect(() => {
    if (user) {
      // getAccounts().then((resp) => {
      //   if (resp) {
      //     dispatch(setContacts(resp))
      //   }
      // })
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
      if (fortmaticLoggedIn !== fortmatic.user.isLoggedIn()) {
        setFortmaticLoggedIn(fortmatic.user.isLoggedIn())
        setaccounts([])
      }
    }
  }, [user]);

  useEffect(() => {
    if (fortmaticLoggedIn !== fortmatic.user.isLoggedIn()) {
      setFortmaticLoggedIn(fortmatic.user.isLoggedIn())
    }
  }, [fortmatic.user])
  
  const openTransak = (address) => {
    let transak = new transakSDK({
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY,  // Your API Key
        environment: 'PRODUCTION', // STAGING/PRODUCTION
        hostURL: window.location.origin,
        defaultCryptoCurrency: 'ETH',
        walletAddress: address, // Your customer's wallet address
        themeColor: '6851ff', // App theme color
        fiatCurrency: 'USD', // INR/GBP
        widgetHeight: '600px',
        widgetWidth: '400px'
    });
    
    // let transak = new transakSDK({
    //   apiKey: '08492b5f-b07c-46d1-86b4-0435a2cf7146',  // Your API Key
    //   environment: 'STAGING', // STAGING/PRODUCTION
    //   defaultCryptoCurrency: 'ETH',

    //   walletAddress: address, // Your customer's wallet address
    //   themeColor: '6851ff', // App theme color
    //   fiatCurrency: 'USD', // INR/GBP
    //   email: '', // Your customer's email address
    //   redirectURL: '',
    //   hostURL: window.location.origin,
    //   widgetHeight: '600px',
    //   widgetWidth: '400px'
    // });
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

  const openTransakModal = (address, amount, token) => {
    let transak = new transakSDK({
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY,  // Your API Key
        environment: 'PRODUCTION', // STAGING/PRODUCTION
        hostURL: window.location.origin,
        cryptoCurrencyCode: token,
        fiatAmount: amount,
        walletAddress: address, // Your customer's wallet address
        themeColor: '6851ff', // App theme color
        fiatCurrency: 'USD', // INR/GBP
        widgetHeight: '600px',
        widgetWidth: '400px'
    });
    
    // let transak = new transakSDK({
    //   apiKey: '08492b5f-b07c-46d1-86b4-0435a2cf7146',  // Your API Key
    //   environment: 'STAGING', // STAGING/PRODUCTION
    //   defaultCryptoCurrency: 'ETH',

    //   walletAddress: address, // Your customer's wallet address
    //   themeColor: '6851ff', // App theme color
    //   fiatCurrency: 'USD', // INR/GBP
    //   email: '', // Your customer's email address
    //   redirectURL: '',
    //   hostURL: window.location.origin,
    //   widgetHeight: '600px',
    //   widgetWidth: '400px'
    // });
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
        setPurchaseModalOpen(false)
    });
  
  }

  const getAccounts = async () => {
    web3.eth.getAccounts().then(async accounts => {
      setAccount(accounts[0])
      setaccounts(accounts)

      const amount = await web3.eth.getBalance(accounts[0])
      if (amount) {
        return setBalance(web3.utils.fromWei(amount.toString(), 'ether'))
      } else {
        return 0
      }
    })
  }

  useEffect(() => {
    getAccounts()
  }, [])

  return (
    <IonPage>
      <IonContent>
        <IonContent className={"ion-padding home-page"} >
          <IonCard className={"owners-acount"} >
            <IonCardHeader>
              <IonCardTitle className={"accounts-title"} >
                Personal Account
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {fortmatic.user.isLoggedIn() && accounts.length > 0 ? 
              <>
                <IonList>
                  {accounts.map((account) => 
                    <PersonalAccountItem tokens={ERC20TOKENS} openModal={openTransak} ownersAccount={true} openTransak={openTransak} account={{name: "", address: account}} />
                  )}
                </IonList>
                <IonButton onClick={() => setPurchaseModalOpen(true)}>
                  Buy Crypto
                </IonButton>
                <IonButton size={"normal"}  onClick={() => openModal(true, "")} >
                  Transfer Funds
                </IonButton>
              </>
              : 
                <IonButton onClick={() => fortmatic.user.login()}>
                  Login / Sign Up To Fortmatic
                </IonButton>
              }
            </IonCardContent>
          </IonCard>
          

          <IonCard className={"accounts-card"}>
            <IonToolbar>
              <IonSegment value={selectedTab} onIonChange={e => setSelectedTab(e.detail.value)}>
                <IonSegmentButton value="contacts">
                  Contacts
                </IonSegmentButton>
                <IonSegmentButton value="transactions">
                  Transactions
                </IonSegmentButton>
                <IonSegmentButton value="prices">
                  Prices
                </IonSegmentButton>
              </IonSegment>
            </IonToolbar>
            {selectedTab === "contacts" ? 
              <ContactsList openModal={openModal} openTransak={openTransak} />

            : selectedTab === "prices" ?
            <IonList className="current-prices">
              <IonSearchbar value={searchString} onIonChange={e => setSearchString(e.detail.value)}></IonSearchbar>

              {currentPrices.length > 0 ?
                currentPrices.filter(it => it.name.toLowerCase().includes(searchString.toLowerCase()))
                  .map((token) => {
                    console.log(token)
                    return(
                      <TokenItem token={token} />
                    )
                  })
              : 
                  <IonItem>
                    <IonLabel>
                      <center>No Current Market Data</center>
                    </IonLabel>
                  </IonItem>
              }
            </IonList>
            :
              <>
                Coming Soon
              </>
            }
          </IonCard>
        </IonContent>
      </IonContent>
      <PurchaseModal  open={purchaseModalOpen}
                      tokenToSend={tokenToSend}
                      amount={purchaseAmount}
                      setAmount={setPurchaseAmount}
                      openTransakModal={openTransakModal}
                      account={account}
                      setPurchaseModalOpen={setPurchaseModalOpen}
                      setTokenToSend={setTokenToSend} />

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

export default withRouter(PaymentPage);
