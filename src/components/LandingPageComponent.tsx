import { RouteComponentProps, withRouter } from "react-router-dom";
import React, { useState } from 'react';
import { IonContent, IonPage,IonRow, IonCol, IonButton, IonList, IonItem, IonCard, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import '../pages/LandingPage.scss'
import { useSelector, useDispatch } from "react-redux";
import { signInWithCustomToken } from "../firebase";
import { setUser } from "../store/actions/userActions";
import FortmaticClient from "../fortmatic";
import { chevronUp, chevronDown } from "ionicons/icons";

interface OwnProps extends RouteComponentProps {}

const LandingPageComponent: React.FC<OwnProps> = ({  history }) => {

  const fortmatic = useSelector((state: any) => state.user.fortmatic)
  const [showInfo, setShowInfo] = useState(false)

  const dispatch = useDispatch()
  const signin = () => {
    FortmaticClient.user.login().then((response: any) => {
      history.push("/wallet")
      signInWithCustomToken(response[0]).then((user: any) => {
        dispatch(setUser(user))
      }).then(() => {
      })
    })
  }

  return (
    <>
        <div className="login-logo">
          <img className={"logo"} src={`assets/icon/logo.png`} alt="Ionic logo" />
        </div>
        <div className="col s12 center-align">
          {/* <h4>
            <span style={{ fontFamily: "monospace" }}>Is it {" "}
            <b>PayDay</b>
            {" "} yet?</span> 
          </h4> */}
          <h2 className="about-title">
            <span style={{ fontFamily: "monospace" }}>New to Crypto? Long term HODLer?</span> 
          </h2>
          <h5>
            <span style={{ fontFamily: "monospace" }}>This is wallet designed For Everyone!</span>
          </h5>
          <IonRow>
          <IonCol>
            <IonButton className={"black-text"} onClick={() => signin()} expand="block">Login / Sign Up</IonButton>
          </IonCol>
        </IonRow>
          <IonRow>
          <IonCol>
            <div>
              <IonCardContent>
                <IonCardTitle className={"about-header"} style={{ fontFamily: "monospace" }}>
                  <u className={"show-info"} onClick={() => setShowInfo(!showInfo)}><b>Why PayDay?</b><IonIcon icon={showInfo ? chevronUp : chevronDown}/></u> 
                </IonCardTitle>
                {showInfo ? 
                  <>
                    <div>
                      No Plugins/Extensions required
                    </div>
                    <div >
                      No long pass phrases to remember
                    </div>
                    <div>
                      2 Factor Authentication
                    </div>
                    <div>
                      Debit Card Access to 27 Cryptocurrencies 
                    </div>
                    <div>
                      Save all of your contacts
                    </div>
                    <div>
                      Desktop and Mobile Support (Mobile app coming soon!)
                    </div>
                    <div>
                      <b>Wallet Powered by Fortmatic</b>
                    </div>
                  </>
                  : 
                  null
                }
              </IonCardContent>
            </div>
          </IonCol>
        </IonRow>  
        </div>
      </>
    );
};

export default withRouter(LandingPageComponent);
