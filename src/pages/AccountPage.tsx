import { RouteComponentProps, withRouter } from "react-router";
import React from "react";
import { IonPage, IonHeader, IonTitle, IonToolbar, isPlatform, IonIcon } from "@ionic/react";
import "./AccountPage.scss"
import { arrowBack } from "ionicons/icons";
import AccountView from "../components/account/AccountView";

interface OwnProps extends RouteComponentProps {}

const AccountPage: React.FC<OwnProps> = ({history}) => {

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
      <AccountView />
    </IonPage>
    );
};

export default withRouter(AccountPage);
