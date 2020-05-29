import { RouteComponentProps, withRouter } from "react-router-dom";
import React from 'react';
import { IonContent, IonPage,IonRow, IonCol, IonButton } from '@ionic/react';
import './LandingPage.scss'

interface OwnProps extends RouteComponentProps {}

const LandingPage: React.FC<OwnProps> = ({  history }) => {

    return (
      <IonPage id="landing-page">
        <IonContent className={"ion-padding"}>
          <div className="login-logo">
            <img className={"logo"} src={`assets/icon/logo.png`} alt="Ionic logo" />
          </div>
          <div className="col s12 center-align">
            <h4>
              <span style={{ fontFamily: "monospace" }}>Is it {" "}
              <b>PayDay</b>
              {" "} yet?</span> 
            </h4>
            <p className="flow-text grey-text text-darken-1">
              The one App for all of your PayDay needs.
              <br />
            </p>
          </div>
          
          <IonRow>
            <IonCol>
              <IonButton className={"black-text"} routerLink="/login" expand="block">Login</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink="/signup" color="light" expand="block">Signup</IonButton>
            </IonCol>
          </IonRow>  
        </IonContent>
  
      </IonPage>
    );
  };

  export default withRouter(LandingPage);
