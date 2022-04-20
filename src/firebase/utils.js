import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import "firebase/compat/storage";
import { firebaseConfig } from "./config"

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
GoogleProvider.setCustomParameters({ prompt: 'select_account' });
// export const signInWithGoogle = () => auth.signInWithPopup(GoogleProvider);

//handleUserProfile - check that user exist in firebase or not
//take userAuth object
export const handleUserProfile = async ({ userAuth, additionalData }) => {
    if (!userAuth) return;
    const { uid } = userAuth;

    //then check userAuth exist in firebase?
    const userRef = firestore.doc(`users/${uid}`);
    const snapshot = await userRef.get();

    //if they do not exist
    if(!snapshot.exists) {
        const { displayName, email } = userAuth;
        const timestamp = new Date();
        const userRoles = ['user']

        try{//create new collection in firebase
            await userRef.set({
                displayName,
                email,
                follow: [],
                avatar: "",
                createdDate: timestamp,
                userRoles,
                point: 0,
                ...additionalData
            })
        } catch(err) {

        }
    }
    return userRef;
}

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {//onAuthStateChanged return function that can make unsubscribe can be use under of this
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe()
            resolve(userAuth)
        }, reject)
    })
}

