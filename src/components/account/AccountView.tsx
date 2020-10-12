import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState, useCallback } from "react";
import { IonContent, IonItem, IonList, IonLabel, IonToggle } from "@ionic/react";
import "../../pages/AccountPage.scss"
import ProfileIdenticon from "../indenticton";
import { setWeb3, setUser, setUseDarkMode } from "../../store/actions/userActions";
import { signout } from "../../firebase";


const AccountView: React.FC = () => {
  
  const user = useSelector((state: any) => state.user.user)
  const walletConnector = useSelector((state: any) => state.user.walletConnector)

  const dispatch = useDispatch()
  const useDarkMode = useSelector((state: any) => state.user.useDarkMode)
  const web3 = useSelector((state: any) => state.user.web3)

  const [account, setAccount] = useState("")

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
      <IonContent>
        <div className="ion-padding-top ion-text-center">
          <ProfileIdenticon size={140} address={account} />
          <IonList inset>
            {user !== null ?
              <>
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
    );
};

export default AccountView;
