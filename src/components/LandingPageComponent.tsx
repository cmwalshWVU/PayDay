import { RouteComponentProps, withRouter } from "react-router-dom";
import React, { useState } from 'react';
import { IonRow, IonCol, IonButton, IonCardTitle, IonCardContent, IonIcon } from '@ionic/react';
import '../pages/LandingPage.scss'
import { useSelector, useDispatch } from "react-redux";
import { setWeb3 } from "../store/actions/userActions";
import { chevronUp, chevronDown } from "ionicons/icons";
import Web3 from "web3";

interface OwnProps extends RouteComponentProps {}

const LandingPageComponent: React.FC<OwnProps> = ({  history }) => {
  const dispatch = useDispatch()

  const walletConnector = useSelector((state: any) => state.user.walletConnector)

  const [showInfo, setShowInfo] = useState(true)

  const login = async () => {
    walletConnector.connect().then((provider: any) => {
      dispatch(setWeb3(new Web3(provider)))
    });
  }


  return (
    <>
        <div className="login-logo">
          <img className={"logo"} src={`assets/icon/logo.png`} alt="Ionic logo" />
        </div>
        <div className="col s12 center-align">
          <h2 className="about-title">
            <span style={{ fontFamily: "monospace" }}>New to Crypto? Long term HODLer?</span> 
          </h2>
          <h5>
            <span style={{ fontFamily: "monospace" }}>This is wallet designed For Everyone!</span>
          </h5>
          <IonRow>
          <IonCol>
            <IonButton className={"login-button"} onClick={() => login()} expand="block">Login / Sign Up</IonButton>
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
