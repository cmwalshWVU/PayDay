import { RouteComponentProps, withRouter } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonItem, IonList, IonInput, IonLabel, IonRow, IonCol, IonToggle, isPlatform, IonIcon } from "@ionic/react";
import "./AccountPage.scss"
import { toast } from "../components/toast";
import Firebase, { updateUsersEmail, updateUsersPassword, signout } from "../firebase";
import { setUser, setUseDarkMode } from "../store/actions/userActions";
import ProfileIdenticon from "../components/indenticton";
import FortmaticClient from "../fortmatic";
import { arrowBack } from "ionicons/icons";

interface OwnProps extends RouteComponentProps {}

const AccountPage: React.FC<OwnProps> = ({history}) => {
  
  const fortmatic = useSelector((state: any) => state.user.fortmatic)

  const user = useSelector((state: any) => state.user.user)

  const dispatch = useDispatch()
  const useDarkMode = useSelector((state: any) => state.user.useDarkMode)
  const web3 = useSelector((state: any) => state.user.web3)

  const [showEditPassword, setShowEditPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState("")
  const [updatedPasswordConfirmed, setUpdatedPasswordConfirmed] = useState("")

  const [showEditEmail, setShowEditEmail] = useState(false);
  const [updatedEmail, setUpdatedEmail] = useState("")
  const [updatedEmailConfirmed, setUpdatedEmailConfirmed] = useState("")
  const [account, setAccount] = useState("")

  const clicked = (text: string) => {
    console.log(`Clicked ${text}`);
  }

  const getAccounts = async () => {
      web3.eth.getAccounts().then((accounts: any) => {
        setAccount(accounts[0])
      })
  }

  useEffect(() => {
      getAccounts()
    }, [web3])

  const updateEmail = async (e: React.FormEvent) => {
    if (updatedEmail === "" || updatedEmailConfirmed === "") {
      toast("Email cannot be blank!")
      return
    } else if (updatedEmail !== updatedEmailConfirmed) {
      toast("Emails do not match!")
      return
    } else if(Firebase.auth().currentUser !== null && Firebase.auth().currentUser!.email !== updatedEmail) {
      const res: any = await updateUsersEmail(updatedEmail)
      if (res) {
        toast("Email updated successfully")
        setUpdatedEmail("")
        setUpdatedEmailConfirmed("")
      } else {
        toast("Error updating email")
      }
    } else {
      toast("Current and Updated email are the same")
    }
  }

  const updatePassowrd = async (e: React.FormEvent) => {
    if (updatedPassword === "" || updatedPasswordConfirmed === "") {
      toast("Updated password is blank")
    } else if(updatedPassword === updatedPasswordConfirmed) {
      const res: any = await updateUsersPassword(updatedPassword)
      if (res) {
        toast("Password updated successfully")
        setUpdatedPassword("")
        setUpdatedPasswordConfirmed("")
      } else {
        toast("Password updating password")
      }
    } else {
      toast("Passwords do not match")
    }
  }

  const logout = () => {
    FortmaticClient.user.logout().then(() => {
      signout().then(() => {
        dispatch(setUser(null))
        history.push("/")
      })
    })
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
        {Firebase.auth().currentUser &&
          (<div className="ion-padding-top ion-text-center">
              <ProfileIdenticon size={140} address={account} />
            {/* <h2>{ user }</h2> */}
            <IonList inset>
              {user !== null ?
                <>
                  <IonItem onClick={() => clicked('Update Picture')}>Update Picture (Coming Soon!)</IonItem>
                  <IonItem className={"account-button"} onClick={() => logout()}>Logout</IonItem>
                </>
                :
                <IonItem>
                  <IonLabel>Use Dark Theme</IonLabel>
                  <IonToggle checked={useDarkMode} onClick={() => dispatch(setUseDarkMode(!useDarkMode))} />
                </IonItem>
              }
            </IonList>
          </div>)
        }
      </IonContent>
    </IonPage>
    );
};
  
export default withRouter(AccountPage);
