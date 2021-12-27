import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAdFe32HGZG423dTYQ0sjeed8QUDv_0m2I',
  authDomain: 'ubiquitiapp.firebaseapp.com',
  projectId: 'ubiquitiapp',
  storageBucket: 'ubiquitiapp.appspot.com',
  messagingSenderId: '445787014203',
  appId: '1:445787014203:web:167b3606f3f3d6f278481e',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();
