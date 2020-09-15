import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
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
import { person, send, wallet, newspaperOutline, newspaper, walletOutline, personOutline } from 'ionicons/icons';
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
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AccountPage from './pages/AccountPage';
import { useSelector, useDispatch } from 'react-redux';
import { setWeb3, setFortmatic, setUser } from './store/actions/userActions';
import Web3 from 'web3';
import FortmaticClient from './fortmatic';
import { provider } from 'web3-core';
import { WidgetModeConfiguration } from 'fortmatic';
import { signInWithCustomToken } from './firebase';
import NewsPage from './pages/NewsPage';
import { setFeed, updateFeed } from './store/actions/newsActions';
import Pusher, { Options } from 'pusher-js';
import { getCurrentPrices } from './store/actions/currentPricesAction';
import DesktopViewPage from './pages/DesktopViewPage';

const App: React.FC = () => {

  const user = useSelector((state: any) => state.user.user)

  const [currentUser, setCurrentUser] = useState(user)
  const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

  const dispatch = useDispatch()

  dispatch(getCurrentPrices())
  
  useEffect(() => {
    setCurrentUser(user)
  }, [user])
  
  useEffect(() => {
    FortmaticClient.configure({ primaryLoginOption: 'phone' } as WidgetModeConfiguration).then(() => {
      FortmaticClient.user.login().then((response: any) => {
        signInWithCustomToken(response[0]).then((user: any) => {
          dispatch(setUser(user))
          return <Redirect to="/wallet" />
        })
      });
    });
    dispatch(setFortmatic(FortmaticClient))
    dispatch(setWeb3(new Web3(FortmaticClient.getProvider() as provider)))
  }, [FortmaticClient])

  useEffect(() => {
    fetch('https://mighty-dawn-74394.herokuapp.com/live')
      .then(response => response.json())
      .then(articles => {
          // dispatch(updateN(articles.articles))
          dispatch(setFeed(articles))
      }).catch(error => console.log(error));
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_ID!, {
        cluster: 'us2',
        encrypted: true
    } as Options);
    pusher.subscribe('news-channel').bind('update-news', (data: any) => {
        // news.push(data.articles)
        dispatch(updateFeed(data.articles))
    })
  }, [])

  return (
  <IonApp className={useDarkMode ? 'dark-theme' : 'light-mode'} >
    <IonReactRouter>
      {isPlatform("mobile") ? 
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/wallet" component={PaymentPage} exact={true} />
            <Route path="/" render={() => user ? <AccountPage /> : <LandingPage />} exact={true} />
            <Route path="/landing" component={LandingPage} exact={true} />
            <Route path="/news" component={NewsPage} />
            <Route render={() => <Redirect to="/" />} />
            {/* <Route path="/login" component={Login} exact={true} />
            <Route path="/signup" component={Signup} exact={true} /> */}
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="main" href="/wallet">
              <IonIcon icon={walletOutline} />
            </IonTabButton>
            <IonTabButton tab="news" href="/news">
              <IonIcon icon={newspaperOutline} />
            </IonTabButton>
            <IonTabButton tab="account" href="/">
              <IonIcon icon={personOutline} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        : 
          <IonRouterOutlet>
            <Route path="/wallet" component={DesktopViewPage} exact={true} />
            <Route path="/" render={() => user ? <AccountPage /> : <LandingPage />} exact={true} />
            <Route render={() => <Redirect to="/" />} />
            {/* <Route path="/login" component={Login} exact={true} />
            <Route path="/signup" component={Signup} exact={true} /> */}
          </IonRouterOutlet>
        }
    </IonReactRouter>
  </IonApp>
  )
};

export default App;
