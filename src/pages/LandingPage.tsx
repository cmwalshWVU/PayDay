import { RouteComponentProps, withRouter } from "react-router-dom";
import React from 'react';
import { IonContent, IonPage,IonRow, IonCol, IonButton, IonList, IonItem, IonCard, IonCardTitle, IonCardContent } from '@ionic/react';
import './LandingPage.scss'
import { useSelector, useDispatch } from "react-redux";
import { signInWithCustomToken } from "../firebase";
import { setUser } from "../store/actions/userActions";
import FortmaticClient from "../fortmatic";

interface OwnProps extends RouteComponentProps {}

const LandingPage: React.FC<OwnProps> = ({  history }) => {

  const fortmatic = useSelector((state: any) => state.user.fortmatic)

  const dispatch = useDispatch()
  const signin = () => {
    FortmaticClient.user.login().then((response: any) => {
      signInWithCustomToken(response[0]).then((user: any) => {
        history.push("/wallet")
        console.log(user)
        dispatch(setUser(user))
      }).then(() => {
      })
    })
  }

  return (
    <IonPage id="landing-page">
      <IonContent className={"ion-padding"}>
        <div className="login-logo">
          <img className={"logo"} src={`assets/icon/logo.png`} alt="Ionic logo" />
        </div>
        <div className="col s12 center-align">
          {/* <h4>
            <span style={{ fontFamily: "monospace" }}>Is it {" "}
            <b>PayDay</b>
            {" "} yet?</span> 
          </h4> */}
          <h4 className="about-title">
            <span style={{ fontFamily: "monospace" }}>New to Crypto? Long term HODLer?</span> 
            {/* <br/> */}
            {/* <span><b>This is wallet designed For Everyone</b></span> */}
          </h4>

          <IonRow>
          <IonCol>
            <div>
              <IonCardContent>
                <IonCardTitle className={"about-header"} style={{ fontFamily: "monospace" }}>
                  <u><b>Why PayDay?</b></u>
                </IonCardTitle>
                <div>
                  No Plugins/Extensions required
                </div>
                <div >
                  No long pass phrases to remember
                </div>
                <div>
                  2 factor authentication
                </div>
                <div>
                  Access to 27 Cryptocurrencies with your debit card
                </div>
                <div>
                  Save your friends and family's addresses
                </div>
                <div>
                  Desktop and Mobile friendly (Native application coming soon!)
                </div>
                <div>
                  <b>Wallet Powered by Fortmatic</b>
                </div>
              </IonCardContent>
            </div>
          </IonCol>
        </IonRow>  
        
        <IonRow>
          <IonCol>
            <IonButton className={"black-text"} onClick={() => signin()} expand="block">Login / Sign Up</IonButton>
          </IonCol>
        </IonRow>
        </div>

      </IonContent>

    </IonPage>
    );
};

export default withRouter(LandingPage);
