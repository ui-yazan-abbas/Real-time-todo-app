import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// if a Firebase instance doesn't exist, create one
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default {
  database: firebase.firestore(),
  auth: firebase.auth(),
  firebase: firebase,
  githubAuth: firebase.auth.GithubAuthProvider.PROVIDER_ID,
  googleAuth: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  facebookAuth: firebase.auth.FacebookAuthProvider.PROVIDER_ID
};
