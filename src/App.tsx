import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { person, send } from 'ionicons/icons';
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
import { useSelector } from 'react-redux';

const App: React.FC = () => {

  const user = useSelector((state: any) => state.user.user)

  const [currentUser, setCurrentUser] = useState(user)
  const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

  useEffect(() => {
    setCurrentUser(user)
  }, [user])
  
  return (
  <IonApp className={useDarkMode ? 'dark-theme' : 'light-mode'} >
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/tab1" component={PaymentPage} exact={true} />
          <Route path="/account" render={() => currentUser ? <AccountPage /> : <LandingPage />} exact={true} />
          <Route path="/landing" component={LandingPage} exact={true} />
          <Route path="/login" component={Login} exact={true} />
          <Route path="/signup" component={Signup} exact={true} />
          <Route path="/" render={() => <Redirect to="/tab1" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={send} />
          </IonTabButton>
          <IonTabButton tab="landing" href="/account">
            <IonIcon icon={person} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  )
};

export default App;
