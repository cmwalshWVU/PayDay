import { RouteComponentProps, withRouter } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState, useCallback } from "react";
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonList, IonLabel, IonToggle, isPlatform, IonIcon } from "@ionic/react";
import "./AccountPage.scss"
import { signout } from "../firebase";
import { setUser, setUseDarkMode, setWeb3 } from "../store/actions/userActions";
import ProfileIdenticon from "../components/indenticton";
import { arrowBack } from "ionicons/icons";

interface OwnProps extends RouteComponentProps {}

const AccountPage: React.FC<OwnProps> = ({history}) => {
  
  const user = useSelector((state: any) => state.user.user)
  const walletConnector = useSelector((state: any) => state.user.walletConnector)

  const dispatch = useDispatch()
  const useDarkMode = useSelector((state: any) => state.user.useDarkMode)
  const web3 = useSelector((state: any) => state.user.web3)

  const [account, setAccount] = useState("")

  const clicked = (text: string) => {
    console.log(`Clicked ${text}`);
  }

  const getAccounts = useCallback(async () => {
    if (web3) {
      web3.eth.getAccounts().then((accounts: any) => {
        setAccount(accounts[0])
      })
    }
  }, [web3])

  useEffect(() => {
      getAccounts()
    }, [getAccounts, web3])

  const logout = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    dispatch(setUser(null))
    dispatch(setWeb3(null))
    signout()
    await walletConnector.clearCachedProvider();

  }

  return (
    <IonPage id="account-page">
      <IonHeader>
      <IonToolbar>
        {isPlatform("mobile") ?
          <IonTitle>Account</IonTitle>
        :
          <IonTitle>
            <IonIcon className={"back-arrow"} onClick={() => history.push("/")} icon={arrowBack}/>
          </IonTitle>
        }
      </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding-top ion-text-center">
          <ProfileIdenticon size={140} address={account} />
          <IonList inset>
            {user !== null ?
              <>
                <IonItem onClick={() => clicked('Update Picture')}>Update Picture (Coming Soon!)</IonItem>
                <IonItem className={"account-button"} onClick={() => logout()}>Logout</IonItem>
                <IonItem>
                  <IonLabel>Use Dark Theme</IonLabel>
                  <IonToggle checked={useDarkMode} onClick={() => dispatch(setUseDarkMode(!useDarkMode))} />
                </IonItem>
              </>
              :
              <IonItem>
                <IonLabel>Use Dark Theme</IonLabel>
                <IonToggle checked={useDarkMode} onClick={() => dispatch(setUseDarkMode(!useDarkMode))} />
              </IonItem>
            }
          </IonList>
        </div>
      </IonContent>
    </IonPage>
    );
};

export default withRouter(AccountPage);
