import { RouteComponentProps, withRouter } from "react-router-dom";
import React from 'react';
import { IonContent, IonPage,IonRow, IonCol, IonButton } from '@ionic/react';
import './LandingPage.scss'
import { useSelector, useDispatch } from "react-redux";
import { signInWithCustomToken } from "../firebase";
import { setUser } from "../store/actions/userActions";

interface OwnProps extends RouteComponentProps {}

const LandingPage: React.FC<OwnProps> = ({  history }) => {

  const fortmatic = useSelector((state: any) => state.user.fortmatic)

  const dispatch = useDispatch()
  const signin = () => {
    fortmatic.user.login().then((response: any) => {
      signInWithCustomToken(response[0]).then((user: any) => {
        console.log(user)
        dispatch(setUser(user))
      }).then(() => {
        history.push("/wallet")

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
            <IonButton className={"black-text"} onClick={() => signin()} expand="block">Login / Sign Up</IonButton>
          </IonCol>
          {/* <IonCol>
            <IonButton onClick={() => fortmatic.user.login()} color="light" expand="block">Signup</IonButton>
          </IonCol> */}
        </IonRow>  
      </IonContent>

    </IonPage>
    );
};

export default withRouter(LandingPage);
