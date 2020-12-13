import { RouteComponentProps, withRouter } from "react-router";
import React from "react";
import { IonPage, IonHeader, IonTitle, IonToolbar, isPlatform, IonIcon } from "@ionic/react";
import "../styles/AccountPage.scss"
import { arrowBack } from "ionicons/icons";
import AccountView from "../../components/account/AccountView";

interface OwnProps {}

const AccountPage: React.FC<OwnProps> = ({}) => {

  return (
    <div id="account-page">
      <IonHeader>
      <IonToolbar>
        {isPlatform("mobile") ?
          <IonTitle>Account</IonTitle>
        :
          <IonTitle>
            <IonIcon className={"back-arrow"} onClick={() => null} icon={arrowBack}/>
          </IonTitle>
        }
      </IonToolbar>
      </IonHeader>
      <AccountView />
    </div>
    );
};

export default AccountPage
