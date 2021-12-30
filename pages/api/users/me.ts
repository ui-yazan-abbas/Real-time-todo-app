import { NextApiRequest, NextApiResponse } from "next";
import * as admin from 'firebase-admin';
import adminData from './ubiquitiapp-firebase-adminsdk-jwru7-e76e2a104b.json'

const  data: any = adminData;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  credential: admin.credential.cert(data),
};

// if a Firebase instance doesn't exist, create one
if (!admin.apps.length) {
  admin.initializeApp(firebaseConfig);
}

//Rest Api
export default async function (req: NextApiRequest, res:NextApiResponse){
  const jwt = req.headers.authorization?.split(`Bearer `)[1];
  console.log(' reading header jwt ??? ', jwt);
  if (jwt) {
    try {
      const { uid } = await admin.auth().verifyIdToken(jwt);
      const currentUser = await admin.firestore().collection('users').doc(uid).get();
      if (currentUser.exists) {
        res.status(200).json({
          currentUser: currentUser.data()
        })
      }
    } catch(error) {
      console.error(error)
      res.status(403).json({
        error: {
          message: `Error validating token`
        }
      })
    }
  } else {
    res.status(403).json({
      error: 'No Valid Token'
    })
  }
}