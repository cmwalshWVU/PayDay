import * as firebase from 'firebase';
import { toast } from './components/toast';

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

export async function getCurrentUser() {
  return await Firebase.auth().currentUser
}

export async function saveNewAccount(newAccount: {name: string, address: string}) {
  const user = Firebase.auth().currentUser
  var docRef = Firebase.firestore().collection('accounts').doc(user!.uid).collection("accounts").doc(newAccount.address)

  Firebase.firestore().collection('accounts').doc(user!.uid).collection("accounts").doc(newAccount.address).set({
    name: newAccount.name,
    address: newAccount.address
  })

  return docRef.get().then(function(doc) {
    if (doc.exists) {
      toast("Error: Duplicate dependent address ", 2000)
      return false
    } else {
      docRef.set({
        name: newAccount.name,
        address: newAccount.address
      }).then(() => {
        return true
      })
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
      return false
  });
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