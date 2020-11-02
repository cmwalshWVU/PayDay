import React, { useEffect, useCallback } from 'react';
import { Redirect, Route, } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  isPlatform
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { newspaperOutline, walletOutline, personOutline, statsChartOutline } from 'ionicons/icons';
import PaymentPage from './pages/PaymentPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import AccountPage from './pages/AccountPage';
import { useSelector, useDispatch } from 'react-redux';

import NewsPage from './pages/NewsPage';
import { setFeed, updateFeed } from './store/actions/newsActions';
import Pusher, { Options } from 'pusher-js';
import { getCurrentPrices } from './store/actions/currentPricesAction';
import MarketPage from './pages/MarketPage';
import { setWeb3, setLoadingBalances, setAccounts, setUser, setContacts } from './store/actions/userActions';
import Web3 from 'web3';
import DesktopApp from './pages/DesktopApp';
import Firebase, { signInWithCustomToken, createAccountCollectionIfNotExists } from './firebase';
import { toast } from './components/toast';


const App: React.FC = () => {

  const useDarkMode = useSelector((state: any) => state.user.useDarkMode)
  const walletConnector = useSelector((state: any) => state.user.walletConnector)
  const web3 = useSelector((state: any) => state.user.web3)
  const user = useSelector((state: any) => state.user.user)

  const dispatch = useDispatch()

  dispatch(getCurrentPrices())
  
  useEffect(() => {
    if (walletConnector.cachedProvider) {
      walletConnector.connect().then((provider: any) => {
        dispatch(setWeb3(new Web3(provider)))
      });
    }
  }, [dispatch, walletConnector])

  // useEffect(() => {
  //   fetch('https://mighty-dawn-74394.herokuapp.com/live')
  //     .then(response => response.json())
  //     .then(articles => {
  //         // dispatch(updateN(articles.articles))
  //         dispatch(setFeed(articles))
  //     }).catch(error => console.log(error));
  //   const pusher = new Pusher(process.env.REACT_APP_PUSHER_ID!, {
  //       cluster: 'us2',
  //       encrypted: true
  //   } as Options);
  //   pusher.subscribe('news-channel').bind('update-news', (data: any) => {
  //       // news.push(data.articles)
  //       dispatch(updateFeed(data.articles))
  //   })
  // }, [dispatch])

  const getAccounts = useCallback(async () => {
    if (web3 && web3.eth) {
    dispatch(setLoadingBalances(true))
    web3.eth.getAccounts().then(async (accounts: string[]) => {
        dispatch(setAccounts(accounts))
        // setAccount(accounts[0])
        // setaccounts(accounts)

        if (!user) {
            signInWithCustomToken(accounts[0]).then((user) => {
                toast("Sucessfully Logged In")
                createAccountCollectionIfNotExists(accounts[0])
                dispatch(setUser(user))
                // return <Redirect to="/wallet" />
            })
        }
    })
    }
  }, [dispatch, user, web3])

  useEffect(() => {
      if (user) {
      const accounts = Firebase.firestore().collection('accounts').doc(user.uid).collection("accounts")
      accounts.onSnapshot(querySnapshot => {
          const accounts: any = []
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

  useEffect(() => {
      const articles = Firebase.firestore().collection('articles').limit(250)
      articles.onSnapshot(querySnapshot => {
          const newsArticles: any = []
          querySnapshot.docs.forEach(doc => {
              const data = doc.data()
              newsArticles.push(data.article)
          });
          dispatch(setFeed(newsArticles))
      }, err => {
          console.log(`Encountered error: ${err}`);
      });
}, [dispatch]);

  useEffect(() => {
      getAccounts()
  }, [web3, getAccounts])

  return (
  <IonApp className={useDarkMode ? 'dark-theme' : 'light-mode'} >
      {isPlatform("mobile") ? 
          mobileApp()
        :
         <DesktopApp />
        }
  </IonApp>
  )
};

const mobileApp = () => {
  return (
    <IonReactRouter>

      <IonTabs>
          <IonRouterOutlet>
            <Route path="/wallet" component={PaymentPage} exact={true} />
            <Route path="/market" component={MarketPage} exact={true} />
            <Route path="/account" component={AccountPage} exact={true} />
            <Route path="/news" component={NewsPage} exact={true} />
            <Route render={() => <Redirect to="/market" />} />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="main" href="/wallet">
              <IonIcon icon={walletOutline} />
            </IonTabButton>
            <IonTabButton tab="market" href="/market">
              <IonIcon icon={statsChartOutline} />
            </IonTabButton>
            <IonTabButton tab="news" href="/news">
              <IonIcon icon={newspaperOutline} />
            </IonTabButton>
            <IonTabButton tab="account" href="/account">
              <IonIcon icon={personOutline} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
  )
}

export default App;
