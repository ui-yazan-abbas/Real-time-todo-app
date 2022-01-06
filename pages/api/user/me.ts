import { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import log from '@logger/index';

const adminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  ),
  clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
};

// if a Firebase instance doesn't exist, create one
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const jwt = req.headers.authorization?.split(`Bearer `)[1];
  if (jwt) {
    try {
      const { uid } = await admin.auth().verifyIdToken(jwt);
      const currentUser = await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .get();
      if (currentUser.exists) {
        res.status(200).json({
          currentUser: currentUser.data(),
        });
      }
    } catch (error) {
      log.info('user not logged in');
      res.status(403).json({
        error: {
          message: `Error validating token`,
        },
      });
    }
  } else {
    res.status(403).json({
      error: 'No Valid Token',
    });
  }
}
