import React, { useEffect, useState } from 'react';
import { IonFab, IonIcon, IonFabButton, IonItem, IonLabel, IonListHeader, IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import './PaymentPage.css';
import transakSDK from '@transak/transak-sdk'
import { add } from 'ionicons/icons';
import { useSelector } from 'react-redux';
import AccountItem from '../components/accountItem';
import NewAccountItem from '../components/NewAccountItem';
import Firebase from '../firebase';
import PortisClient from '../portis';
import web3 from '../web3';

const PaymentPage = () => {
  const [accounts, setaccounts] = useState([])
  const [account, setAccount] = useState([])
  const [dependentAccounts, setDependentAccounts] = useState([])
  const [portisLoggedIn, setPortisLoggedIn] = useState(PortisClient.isLoggedIn())
  const [addNewUser, setAddNewUser] = useState(false)

  const user = useSelector((state) => state.user.user)

  useEffect(() => {
    if (user) {
      PortisClient.setDefaultEmail(user.email)
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
    }
  }, [user]);

  useEffect(() => {
    if (portisLoggedIn !== PortisClient.isLoggedIn()) {
      setPortisLoggedIn(PortisClient.isLoggedIn())
    }
  }, [portisLoggedIn])
  
  const openTransak = (address) => {
    let transak = new transakSDK({
        apiKey: process.env.REACT_APP_TRANSAK_API_KEY ? process.env.REACT_APP_TRANSAK_API_KEY : 'DEFULT_TRANSAK_KEY',  // Your API Key
        environment: 'STAGING', // STAGING/PRODUCTION
        defaultCryptoCurrency: 'ETH',
        walletAddress: address, // Your customer's wallet address
        themeColor: 'c0c0c0', // App theme color
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
    
    web3.eth.getAccounts().then(accounts => {
      setAccount(accounts[0])
      setaccounts(accounts)
    })
  }

  useEffect(() => {
    getAccounts()
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
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
              {accounts.length > 0 ? 
              <>
                <IonList>
                  {accounts.map((account) => 
                    <AccountItem web3={web3} ownersAccount={true} openTransak={openTransak} account={{name: "", address: account}} />
                  )}
                </IonList>
                <IonButton onClick={() => openTransak(account)}>
                  Add Funds
                </IonButton>
                <IonButton onClick={() => PortisClient.showBitcoinWallet()}>
                  Open Wallets
                </IonButton>
              </>
              : 
                <IonButton onClick={() => PortisClient.showPortis()}>
                  Login To Portis Wallet
                </IonButton>
              }
            </IonCardContent>
          </IonCard>
          

          <IonCard className={"accounts-card"}>
            <IonList>
              <IonListHeader>
                <IonTitle>
                  Dependent Accounts
                </IonTitle>
              </IonListHeader>
              {user !== null ? 
                <>
                  <IonButton onClick={() => PortisClient.showPortis()}>
                    Transfer Funds
                  </IonButton>
                  {addNewUser && <NewAccountItem setAddNewUser={setAddNewUser} />}
                  {dependentAccounts.length > 0 ? dependentAccounts.map((account) => (
                    <AccountItem account={account} web3={web3} openTransak={openTransak} />
                  )) : 
                    <IonItem>
                      <IonLabel>
                        <center>Add new dependents to track</center>
                      </IonLabel>
                    </IonItem>
                  }
                  {/* {DEFAULT_ACCOUNTS.map((account) => (
                    <AccountItem account={account} web3={web3} openTransak={openTransak} />
                  ))} */}
                </>
                : 
                <IonButton className={"login"} size="small" routerLink="/login" expand="block">Login</IonButton>
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
    </IonPage>
  );
};

export default PaymentPage;
