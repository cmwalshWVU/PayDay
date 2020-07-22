import React, { useEffect, useState } from 'react';
import { IonFab, IonIcon, IonFabButton, IonItem, IonLabel, IonListHeader, IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonModal, IonInput, IonButtons, IonFooter } from '@ionic/react';
import './PaymentPage.scss';
import transakSDK from '@transak/transak-sdk'
import { add } from 'ionicons/icons';
import { useSelector, useDispatch } from 'react-redux';
import AccountItem from '../components/accountItem';
import NewAccountItem from '../components/NewAccountItem';
import Firebase, { signout } from '../firebase';
import { setUser } from '../store/actions/userActions';
import { withRouter } from 'react-router';
import FortmaticClient from '../fortmatic';
import { DAI, MKR, ERC20TOKENS } from '../components/Erc20Tokens';
import PersonalAccountItem from '../components/personalAccountItem'

const PaymentPage = (props) => {
  const [accounts, setaccounts] = useState([])
  const [account, setAccount] = useState([])
  const [amount, setAmount] = useState("0.0");
  const [gas, setGas] = useState("0.0");
  const [balance, setBalance] = useState("0");

  const fortmatic = useSelector((state) => state.user.fortmatic)

  const web3 = useSelector((state) => state.user.web3)

  const [dependentAccounts, setDependentAccounts] = useState([])
  const [fortmaticLoggedIn, setFortmaticLoggedIn] = useState(fortmatic ? fortmatic.user.isLoggedIn() : false)

  const [addNewUser, setAddNewUser] = useState(false)
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

  const depositFortmatic = () => {
    fortmatic.user.deposit();
  }

  const openFortmaticTransfer = (transferAmount, fromAddress, toAddress) => {
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
  }

  const user = useSelector((state) => state.user.user)


  useEffect(() => {
    if (user) {
      getAccounts().then((resp) => {
        if (resp) {
          setDependentAccounts(resp)
        }
      })
      const accounts = Firebase.firestore().collection('accounts').doc(user.uid).collection("accounts")
      accounts.onSnapshot(querySnapshot => {
          const accounts = []
          querySnapshot.docs.forEach(doc => {
              const data = doc.data()
              accounts.push(data)
          });
          console.log(accounts)
          setDependentAccounts(accounts)
      }, err => {
          console.log(`Encountered error: ${err}`);
      });
    } else {
      if (fortmaticLoggedIn !== fortmatic.user.isLoggedIn()) {
        console.log(fortmatic.user)
        setFortmaticLoggedIn(fortmatic.user.isLoggedIn())
        setaccounts([])
      }
    }
  }, [user]);

  useEffect(() => {
    if (fortmaticLoggedIn !== fortmatic.user.isLoggedIn()) {
      console.log(fortmatic.user)
      setFortmaticLoggedIn(fortmatic.user.isLoggedIn())
    }
  }, [fortmatic.user])
  
  const openTransak = (address) => {
    let transak = new transakSDK({
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY ? process.env.REACT_APP_TRANSAK_API_KEY : 'DEFULT_TRANSAK_KEY',  // Your API Key
        environment: 'PRODUCTION', // STAGING/PRODUCTION
        defaultCryptoCurrency: 'ETH',
        cryptoCurrencyList: 'ETH,BAND,BAT,BNB,CBAT,CDAI,CEL,CETH,CUSDC,CZRX,DAI,KNC,LEND,LINK,MATIC,MKR,OMG,PAX,POWR,REN,RLC,SNX,UBT,USDC,USDT,WETH,ZRX',
        walletAddress: address, // Your customer's wallet address
        themeColor: '6851ff', // App theme color
        fiatCurrency: 'USD', // INR/GBP
        email: '', // Your customer's email address
        redirectURL: '',
        hostURL: window.location.origin,
        widgetHeight: '600px',
        widgetWidth: '400px'
    });
    
    transak.init();
    
    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
        console.log(data)
    });
    
    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log(orderData);
        transak.close();
    });
  
  }

  const getAccounts = async () => {
    // const accounts = await web3.eth.getAccounts()
    // const [address] = accounts
    
    web3.eth.getAccounts().then(async accounts => {
      setAccount(accounts[0])
      setaccounts(accounts)

      const amount = await web3.eth.getBalance(accounts[0])
      if (amount) {
        console.log(Number(web3.utils.fromWei(amount.toString(), 'ether')))
        return setBalance(web3.utils.fromWei(amount.toString(), 'ether'))
      } else {
        console.log("nothing")

        return 0
      }
    })
  }

  useEffect(() => {
    getAccounts()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PayDay</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className={"ion-padding home-page"} >
          <IonCard >
            <IonCardHeader>
              <IonCardTitle className={"accounts-title"} >
                Personal Accounts
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
                <IonButton onClick={() => openTransak(account)}>
                  Buy Crypto
                </IonButton>
                <IonButton onClick={() => {
                  fortmatic.user.logout().then(() => {
                    signout().then(() => {
                      dispatch(setUser(null))
                      props.history.push("/landing") 
                    })
                  })
                }}>
                  Logout
                </IonButton>
              </>
              : 
                <IonButton onClick={() => FortmaticClient.user.login()}>
                  Login To Fortmatic
                </IonButton>
              }
            </IonCardContent>
          </IonCard>
          

          <IonCard className={"accounts-card"}>
            <IonCardHeader className={"contacts-header"}>
              <IonCardTitle>
                Contacts
              </IonCardTitle>
            </IonCardHeader>
            <IonList>
              {user !== null ? 
                <>
                  <IonButton size={"normal"}  onClick={() => openModal(true, "")} >
                    Transfer Funds
                  </IonButton>
                  {addNewUser && <NewAccountItem setAddNewUser={setAddNewUser} />}
                  {dependentAccounts.length > 0 ? 
                    dependentAccounts.map((account) => (
                      <AccountItem tokens={ERC20TOKENS} openModal={openModal} account={account} web3={web3} openTransak={openTransak} />
                    )) : 
                      <IonItem>
                        <IonLabel>
                          <center>Add new dependents to track</center>
                        </IonLabel>
                      </IonItem>
                    }
                </>
                : 
                <IonItem>
                  <IonLabel>
                    <center>Login to add contacts</center>
                  </IonLabel>
                </IonItem>
              }
            </IonList>
          </IonCard>
        </IonContent>
      </IonContent>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setAddNewUser(true)}>  
              <IonIcon className={"black-text"} icon={add} />
          </IonFabButton>
      </IonFab>


      <IonModal className={"transfer-modal"} isOpen={open} onDidDismiss={() => setOpen(false)}>
        <IonContent className={"transfer-modal-content ion-padding"}>
          <IonHeader>
            <IonTitle className="transfer-modal-title">Transfer Funds</IonTitle>
          </IonHeader>
          <IonList className="address-inputs">
            <IonItem>
              <IonLabel position="stacked" color="primary">From:</IonLabel>
              <IonInput readonly name="transferToAddress" type="text" value={account} />
            </IonItem> 
            <IonItem>
              <IonLabel position="stacked" color="primary">To:</IonLabel>
              <IonInput readonly={transferToAddress !== ""} name="transferToAddress" type="text" value={transferToAddress} />
            </IonItem> 
          </IonList>
          <IonList className="amount-inputs">
            <IonItem>
              <IonLabel position="stacked" color="primary">Amount:</IonLabel>
              <IonInput max={balance} clearInput name="transferToAddress" value={amount} onIonChange={e => setAmount(e.detail.value)}/>
            </IonItem> 
          </IonList>
          <div className="modal-buttons">
            <IonButton color="primary" onClick={() => openFortmaticTransfer(amount, account, transferToAddress)}>Transfer</IonButton>
            <IonButton color="light" onClick={() => setOpen(false)}>Cancel</IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default withRouter(PaymentPage);
