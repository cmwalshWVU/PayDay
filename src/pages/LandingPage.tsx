import { RouteComponentProps, withRouter } from "react-router-dom";
import React from 'react';
import { IonContent, IonPage,IonRow, IonCol, IonButton, IonCardTitle, IonCardContent } from '@ionic/react';
import './LandingPage.scss'
import { useSelector, useDispatch } from "react-redux";
import { setWeb3 } from "../store/actions/userActions";
import Web3 from "web3";
import Fortmatic from "fortmatic";
import Portis from "@portis/web3";
import Web3Modal from 'web3modal'

interface OwnProps extends RouteComponentProps {}

const LandingPage: React.FC<OwnProps> = () => {

  const dispatch = useDispatch()

  const walletConnector = useSelector((state: any) => state.user.walletConnector)

  const login = async () => {
    walletConnector.connect().then((provider: any) => {
      dispatch(setWeb3(new Web3(provider)))
    });
  }

  const createWallet = async () => {
    const providerOptions = {
      fortmatic: {
        display: {
          description: "Create a Fortmatic Wallet"
        },
        package: Fortmatic, // required
        options: {
          key: "pk_live_633916DC39808625" // required
        }
      },
      portis: {
        display: {
          description: "Create a Portis Wallet"
        },
        package: Portis, // required
        options: {
          id: "03f7a85e-c77c-42d0-b307-ff74a0ef6ae6" // required
        }
      }
    };

    const WalletConnector = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        theme: "dark",
        providerOptions // required
    });

    WalletConnector.connect().then((provider: any) => {
      dispatch(setWeb3(new Web3(provider)))
      dispatch({
        type: 'SET_WALLET_CONNECT',
        walletConnector: WalletConnector
      })
    });
  }

  return (
    <IonPage id="landing-page">
      <IonContent className={"ion-padding"}>
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
          <IonRow className="login-button-container">
            <IonButton className={"login-button"} onClick={() => login()} expand="block">Connect Wallet</IonButton>
            <IonButton className={"login-button"} onClick={() => createWallet()} expand="block">Create Wallet</IonButton>
          </IonRow>
          <IonRow>
          <IonCol>
            <div>
              <IonCardContent>
                <IonCardTitle className={"about-header"} style={{ fontFamily: "monospace" }}>
                  <u className={"show-info"}>
                    <b>Why PayDay?</b>
                  </u> 
                </IonCardTitle>
                <>
                  <div>
                    Debit Card Access to 320+ Cryptocurrencies
                  </div>
                  <div >
                    Performance Tracking for your holdings
                  </div>
                  <div>
                    Save all of your contacts
                  </div>
                  <div>
                    No Plugins/Extensions required
                  </div>
                  <div>
                    Desktop and Mobile Support
                  </div>
                </>
              </IonCardContent>
            </div>
          </IonCol>
        </IonRow>  
        </div>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(LandingPage);
