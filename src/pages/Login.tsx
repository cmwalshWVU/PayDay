import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText, IonLoading } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { toast } from '../components/toast';
import { useDispatch } from 'react-redux';
import { loginUser } from '../firebase';
import { setUser } from '../store/actions/userActions';


interface OwnProps extends RouteComponentProps {}

const Login: React.FC<OwnProps> = (props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const login = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
    setFormSubmitted(true);
    if(!email) {
      toast("email is required")
      setUsernameError(true);
      return
    } else if(!password) {
      toast("password is required")
      setPasswordError(true);
      return
    } else if(email && password) {
      const user = {
        email: email,
        password: password
      };

      loginUser(user).then((res) => {
        if (res) {
          dispatch(setUser(res))
          toast("You have logged in!")
          props.history.push('/tab1', {direction: 'none'});
        } else {
          setLoading(false)
        }
      }).catch(() => {
        setLoading(false)
      })
    }
    setLoading(false)
  };

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={"ion-padding"}>
        <IonLoading message={"Authentication in progress!"} duration={2000} isOpen={loading} />
        <form noValidate onSubmit={login}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">Email</IonLabel>
              <IonInput name="email" type="text" value={email} spellCheck={false} autocapitalize="off" onIonChange={e => setEmail(e.detail.value!)}
                required>
              </IonInput>
            </IonItem> 

            {formSubmitted && usernameError && <IonText color="danger">
              <p className="ion-padding-start">
                Username is required
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">Password</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {formSubmitted && passwordError && <IonText color="danger">
              <p className="ion-padding-start">
                Password is required
              </p>
            </IonText>}
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton routerLink="/account" className={"black-text"} color="light" expand="block">Cancel</IonButton>
            </IonCol>
            <IonCol>
              <IonButton type="submit" expand="block">Login</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
  );
};

export default Login