import React, { useEffect, useState } from 'react';
import { IonFab, IonIcon, IonFabButton, IonItem, IonLabel, IonListHeader, IonList, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonModal, IonInput, IonButtons, IonFooter, IonSelectOption, IonSelect, IonSegment, IonSegmentButton, IonSearchbar, IonAvatar } from '@ionic/react';
import './PaymentPage.scss';
import transakSDK from '@transak/transak-sdk'
import { add } from 'ionicons/icons';
import { useSelector, useDispatch } from 'react-redux';
import AccountItem from '../components/accountItem';
import NewAccountItem from '../components/NewAccountItem';
import Firebase, { signout } from '../firebase';
import { setUser, setContacts } from '../store/actions/userActions';
import { withRouter } from 'react-router';
import FortmaticClient from '../fortmatic';
import { DAI, MKR, ERC20TOKENS } from '../components/Erc20Tokens';
import PersonalAccountItem from '../components/personalAccountItem'
import { erc20ContractAbi } from '../components/Erc20TokenAbi';
import { isString } from 'util';
import TokenItem from '../components/TokenItem';
import PurchaseModal from '../components/PurchaseModal';
import ContactsList from '../components/ContactsList';
import TransferModal from '../components/TransferModal';
import ProfileIdenticon from '../components/indenticton';
import ArticleList from '../components/ArticleList';
import DesktopArticleList from '../components/desktopArticleList';

const PaymentPage = (props) => {
  const [accounts, setaccounts] = useState([])
  const [account, setAccount] = useState([])
  const [amount, setAmount] = useState("0.0");
  const [gas, setGas] = useState("0.0");
  const [balance, setBalance] = useState("0");
  const [tokenToSend, setTokenToSend] = useState("ETH")

  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState(0);

  const fortmatic = useSelector((state) => state.user.fortmatic)
  const contacts = useSelector((state) => state.user.contacts)

  const web3 = useSelector((state) => state.user.web3)

  const [dependentAccounts, setDependentAccounts] = useState([])
  const [fortmaticLoggedIn, setFortmaticLoggedIn] = useState(fortmatic ? fortmatic.user.isLoggedIn() : false)

  const [addNewUser, setAddNewUser] = useState(false)
  const [open, setOpen] = useState(false)
  const [transferToAddress, setTransferToAddress] = useState("")
  const [selectedTab, setSelectedTab] = useState("contacts")

  const [searchString, setSearchString] = useState("")

  const [selectedView, setSelectedView] = useState("Market")

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

  const [news, setNews] = useState([])

  function refresh(event) {
    fetch('https://mighty-dawn-74394.herokuapp.com/live')
        .then(response => response.json())
        .then(articles => {
            // dispatch(updateN(articles.articles))
            setNews(articles);
            event.detail.complete();
        }).catch(error => {
            event.detail.complete();
        }
    );
}

  return (
    <IonPage>
      <div className="desktopview">
          <IonList className="menu-list">
            <IonListHeader>
            <IonAvatar className={"avatar"} onClick={() => props.history.push("/")}>
              <ProfileIdenticon size={40} string={accounts[0]} />
            </IonAvatar>
            </IonListHeader>
            {/* <div className="list-items">
              <IonItem className={selectedView === "Recent News" ? "selected" : null} onClick={() => setSelectedView("Recent News")}>
                News
              </IonItem>
              <IonItem className={selectedView === "Current Prices" ? "selected" : null} onClick={() => setSelectedView("Current Prices")}>
                Prices
              </IonItem>
              <IonItem className={selectedView === "Contacts" ? "selected" : null} onClick={() => setSelectedView("Contacts")}>
                Contacts
              </IonItem>
              <IonItem className={selectedView === "Transactions" ? "selected" : null} onClick={() => setSelectedView("Transactions")}>
                Transactions
              </IonItem>
            </div> */}
            <div className="list-items">
              <IonItem className={selectedView === "Market" ? "selected" : null} onClick={() => setSelectedView("Market")}>
                Market
              </IonItem>
              <IonItem className={selectedView === "Wallet" ? "selected" : null} onClick={() => setSelectedView("Wallet")}>
                Wallet
              </IonItem>
            </div>
          </IonList>
          <IonContent className={"ion-padding home-page"} >

            <div className="main-content">
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
                    <IonButton onClick={() => FortmaticClient.user.login()}>
                      Login To Fortmatic
                    </IonButton>
                  }
                </IonCardContent>
              </IonCard>
              { selectedView === "Market" ?
                <div className="market-cards">
                  <IonCard className={`main-card ${selectedView === "Recent News" ? "news-card" : selectedView === "Current Prices" ? "price-card" : null} `}>
                    <IonCardHeader>
                      <IonCardTitle className={"accounts-title"} >
                        Recent News
                      </IonCardTitle>
                    </IonCardHeader>
                    <div className="current-prices">
                      <DesktopArticleList  news={news} />
                    </div>
                  </IonCard>
                  <IonCard className={`main-card ${selectedView === "Recent News" ? "news-card" : selectedView === "Current Prices" ? "price-card" : null} `}>
                    <IonCardHeader>
                      <IonCardTitle className={"accounts-title"} >
                        Current Prices
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonSearchbar value={searchString} onIonChange={e => setSearchString(e.detail.value)}></IonSearchbar>
                    <IonList className="current-prices">
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
                  </IonCard>
                </div>
              : 
              <div className="market-cards">
                  <IonCard className={`main-card ${selectedView === "Recent News" ? "news-card" : selectedView === "Current Prices" ? "price-card" : null} `}>
                    <IonCardHeader>
                      <IonCardTitle className={"accounts-title"} >
                        Contacts
                      </IonCardTitle>
                    </IonCardHeader>
                    <ContactsList openModal={openModal} openTransak={openTransak} />
                  </IonCard>
                  <IonCard className={`main-card ${selectedView === "Recent News" ? "news-card" : selectedView === "Current Prices" ? "price-card" : null} `}>
                    <IonCardHeader>
                      <IonCardTitle className={"accounts-title"} >
                        Transactions
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <>
                        Coming Soon
                      </>
                    </IonCardContent>
                  </IonCard>
                </div>

              }
              {/* <IonCard className={`main-card ${selectedView === "Recent News" ? "news-card" : selectedView === "Current Prices" ? "price-card" : null} `}>
                {selectedView !== "Recent News" ?
                  <IonCardHeader>
                    <IonCardTitle className={"accounts-title"} >
                      {selectedView}
                    </IonCardTitle>
                  </IonCardHeader>
                  : null
                }
                {selectedView === "Recent News" ? 
                  <div className="news-list">
                    <DesktopArticleList  news={news} />
                  </div>
                  : selectedView === "Current Prices" ?
                  <>
                  <IonSearchbar value={searchString} onIonChange={e => setSearchString(e.detail.value)}></IonSearchbar>
                  <IonList className="current-prices">
                  
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
                </>
                  : selectedView === "Transactions" ?
                    <IonCardContent>
                      <>
                        Coming Soon
                      </>
                    </IonCardContent>
                  :
                  <ContactsList openModal={openModal} openTransak={openTransak} />
                }
            </IonCard> */}
              
          </div>
        </IonContent>
      </div>

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
