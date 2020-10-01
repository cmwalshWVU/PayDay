import * as firebase from 'firebase';
import { toast } from './components/toast';
import * as firebaseAdmin from "firebase-admin";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const Firebase  = firebase.initializeApp(config);

export default Firebase

var serviceAccount = {
      type: "service_account",
      project_id: process.env.REACT_APP_PROJECT_ID!!,
      private_key_id: process.env.REACT_APP_PRIVATE_KEY_ID!!,
      private_key: process.env.REACT_APP_PRIVATE_KEY!!.replace(/\\n/g, '\n'),
      client_email: process.env.REACT_APP_CLIENT_EMAIL!!,
      client_id: process.env.REACT_APP_CLIENT_ID!!,
      auth_uri: process.env.REACT_APP_AUTH_URI!!,
      token_uri: process.env.REACT_APP_TOKEN_URI!!,
      auth_provider_x509_cert_url: process.env.REACT_APP_AUTH_PROVIDER_X509_CERT_URL!!,
      client_x509_cert_url: process.env.REACT_APP_CLIENT_X509_CERT_URL!!
    }

const FirebaseAdmin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount as firebaseAdmin.ServiceAccount),
  databaseURL: process.env.REACT_APP_ADMIN_DATABASE_URL
});

export async function getCurrentUser() {
  return await Firebase.auth().currentUser
}

export function updateContact(email: string) {
  var user = firebase.auth().currentUser;
  if (user) {
      user.updateEmail(email).then(response => {
          toast("Email successfully updated.", 2000)
          return true
        }).catch(error => {
          toast(error.message, 2000)
          return false
        });
  }
}
export async function saveNewAccount(newAccount: {name: string, address: string}) {
  const user = Firebase.auth().currentUser
  // var docRef = Firebase.firestore().collection('accounts').doc(user!.uid).collection("accounts").doc(newAccount.address)

  Firebase.firestore().collection('accounts').doc(user!.uid).collection("accounts").doc(newAccount.address).set({
    name: newAccount.name,
    address: newAccount.address
  }).catch(function(error) {
    return false
  });

  // return docRef.get().then(function(doc) {
  //   if (doc.exists) {
  //     toast("Error: Duplicate dependent address ", 2000)
  //     return false
  //   } else {
  //     docRef.set({
  //       name: newAccount.name,
  //       address: newAccount.address
  //     }).then(() => {
  //       return true
  //     })
  //   }
  // }).catch(function(error) {
  //     console.log("Error getting document:", error);
  //     return false
  // });
}

export async function deleteAccount(address: string) {
  const user = Firebase.auth().currentUser
  Firebase.firestore().collection('accounts').doc(user!.uid).collection("accounts").doc(address).delete()
}

export async function getAccounts() {
  const user = Firebase.auth().currentUser

  const accounts = Firebase.firestore().collection('accounts').doc(user!.uid).collection("accounts").get()
      .then(res => {
          const accounts:any[] = []
          res.forEach(r => {
            const data = r.data().holding
            accounts.push(data)
          })
          return accounts
      })
      .catch(err => {
          console.log(err)           
  });

  return accounts
}
export async function isAuthenticated() {
  return await Firebase.auth().currentUser !== null
}

export async function signout() {
  Firebase.auth().signOut().then(() => {
    toast("User signed out", 2000)
  })
}

export function updateUsersEmail(email: string) {
  var user = firebase.auth().currentUser;
  if (user) {
      user.updateEmail(email).then(response => {
          toast("Email successfully updated.", 2000)
          return true
        }).catch(error => {
          toast(error.message, 2000)
          return false
        });
  }
}

export function updateUsersPassword(password: string) {
  var user = firebase.auth().currentUser;
  if (user) {
      user.updatePassword(password).then(response => {
          toast("Password successfully updated.", 2000)
          return true
        }).catch(error => {
          toast(error.message, 2000)
          return false
        });
  }
}

export async function signInWithCustomToken(token: any) {
  const accessToken = await FirebaseAdmin.auth().createCustomToken(token)
    .then(function(customToken) {
      return Firebase.auth().signInWithCustomToken(customToken).then((response) => {
        // console.log("signed in to firebase")

        // console.log(response.user)
        return response.user
        // dispatch({ type: 'COINBASE_LOGIN_SUCCESS', token: accessToken});
      }).catch((err: any) => {
        // console.log("ERRRR signing in to firebase")

        // console.log(err)
        return null
      })
    }).catch((err) => {
      // console.log("ERRRR signing in to firebase")

        // console.log(err)
        return null
    })
  // console.log("token")
  // console.log(accessToken)
  return accessToken
}

export async function loginUser(userData: {email: string, password: string}) {
  try {
    const res = await Firebase.auth().signInWithEmailAndPassword(
      userData.email,
      userData.password
    )

    if (res) {
      return res.user
    } else {
      return null
    }
  } catch (error) {
    toast(error.message, 2000)
    return false
  }
}

export async function registerUser(userData: {email: string, password: string, name: string}) {
    try {
      const res = Firebase.auth().createUserWithEmailAndPassword(
        userData.email,
        userData.password
      ).then(async (resp) => {
          await Firebase.firestore().collection('users').doc(resp!.user!.uid).set({
              name: userData.name,
              userEmail: userData.email
          })
          return true
      }).catch((error) => {
        toast(error.message, 2000)
        return false
      })

      return res
    } catch (error) {
      toast(error.message, 2000)
      return false
    }
  }