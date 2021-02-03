import React from 'react'
import { IonList, IonListHeader, IonItem, IonIcon } from '@ionic/react';
import { logoTwitter, logoGooglePlaystore, gridOutline, newspaperOutline, statsChartOutline, contrastOutline, logOutOutline } from 'ionicons/icons';
import { useSelector, useDispatch } from 'react-redux';
import './Menu.scss'
import { setUseDarkMode, setUser, setWeb3 } from '../store/actions/userActions';
import { signout } from '../firebase';
import { toast } from './toast';

interface Props {
  setSelectedView: (view: string) => void
  selectedView: string
}

const Menu: React.FC<Props> = ({selectedView, setSelectedView}) => {
    const useDarkMode = useSelector((state: any) => state.user.useDarkMode)
    const user = useSelector((state: any) => state.user.user)
    const web3 = useSelector((state: any) => state.user.web3)
    const walletConnector = useSelector((state: any) => state.user.walletConnector)

    const dispatch = useDispatch()

    const setSelectedPage = (page: string) => {
      setSelectedView(page)
    }

    const logout = async () => {
      if (web3 && web3.currentProvider && web3.currentProvider.close) {
        await web3.currentProvider.close();
      }
      dispatch(setUser(null))
      dispatch(setWeb3(null))
      signout()
      toast("Loggeded Out")

      await walletConnector.clearCachedProvider();
  
    }
    return (
        <IonList className={`${useDarkMode ? 'menu-dark' : 'menu-light'} menu-list`}>
            <IonListHeader className="menu-header">
              <img className={"icon"} src={`assets/icon/noTextLogo.png`} alt="Ionic logo" />
            </IonListHeader>
            <div className="list-items">
              <IonItem className={`${selectedView === "dashboard" ? "selected" : null} ${useDarkMode ? 'item-dark': 'item-light'}`} onClick={() => setSelectedPage("dashboard")}>
                <IonIcon className={"menu-icon"} icon={gridOutline} color={selectedView === "dashboard" ? "primary" : ""} />
                Dashboard
              </IonItem>
              <IonItem className={`${selectedView === "market" ? "selected" : null} ${useDarkMode ? 'item-dark': 'item-light'}`} onClick={() => setSelectedPage("market")}>
                <IonIcon className={"menu-icon"} icon={statsChartOutline} color={selectedView === "market" ? "primary" : ""} />
                Market
              </IonItem>
              <IonItem className={`${selectedView === "news" ? "selected" : null} ${useDarkMode ? 'item-dark': 'item-light'}`} onClick={() => setSelectedPage("news")}>
                <IonIcon className={"menu-icon"} icon={newspaperOutline} color={selectedView === "news" ? "primary" : ""} />
                News
              </IonItem>
              {/* <IonItem className={`${selectedView === "account" ? "selected" : null} ${useDarkMode ? 'item-dark': 'item-light'}`} onClick={() => setSelectedPage("account")}>
                <IonIcon className={"menu-icon"} icon={personOutline} color={selectedView === "account" ? "primary" : ""} />
                Account
              </IonItem> */}
              <IonItem className={`${useDarkMode ? 'item-dark': 'item-light'}`} onClick={() => dispatch(setUseDarkMode(!useDarkMode))} >
                <IonIcon className={"menu-icon"} icon={contrastOutline} />
                Dark Mode
              </IonItem>
              {/* {user &&
                <IonItem className={`${useDarkMode ? 'item-dark': 'item-light'}`} onClick={() => logout()} >
                  <IonIcon className={"menu-icon"} icon={logOutOutline} />
                  Logout
                </IonItem>
              } */}
            </div>
            <div className="icons">
            {user &&
                <IonItem className={`${useDarkMode ? 'item-dark': 'item-light'} logout-item`} onClick={() => logout()} >
                  <IonIcon className={"menu-icon"} icon={logOutOutline} />
                  Logout
                </IonItem>
              }
            <IonItem className={"logos item-light"}>
              <IonIcon className={"twitter"} icon={logoTwitter} onClick={() => window.open("https://twitter.com/PayDayWallet", '_blank')} />
              <IonIcon className={"google"} icon={logoGooglePlaystore} onClick={() => window.open("https://play.google.com/store/apps/details?id=payday.wallet", '_blank')} />
            </IonItem>
            </div>
        </IonList>
    )
}

export default Menu