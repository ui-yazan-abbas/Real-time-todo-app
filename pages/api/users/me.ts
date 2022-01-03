import { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import log from '@logger/index';

// TODO move to env file
const adminConfig = {
  projectId: 'ubiquitiapp',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDV2oqZNPawXw2d\nMPpbVGxWgj0V3lz+YvVPa601QXFM4e5WIuwXzRepsxvP4ByvgH15IIKKg91+N2YC\nEtni5WObX8KpsdAlBWlfpJf91UnTLwaQsKmApG3lObCcs1DY/nTe4ARXsksRzTo/\n1T9KLBqASHylVoVcmUQZR9E86ZRzq6hFfomL+3I/BGORbjYp4XN7uI0FRWCU7VrF\n4xC6JaXZad0FATilgbWDzy3DL0hLsDLFpT3p9ssadePBGoZaDLOeCvgBX9MVu3lj\nRMCbUkDXMFvMfFw1POhH5H+Nfe3+mmFAKNTC1khNLgcM4MZIViC3/p+tRNq1/J9n\nB5Y4o5LpAgMBAAECggEAKlUJbIx0bLNUMZKZbGzIyVMcnnCW/fA+2QrajZk3wV1T\n3Y8qJwf9MCV5UuvtIbyQmeKalKrHtI1ozu5GXUjFL+OD2C2Po1Rv6HPfdmq7I2fC\np++gjgt+iYqi8FH6pgmwvtGfanCrtYlnh21CCv+x+0TeD6iR26OnPE3gGGuwbDjo\n/l6xq1Y1UDYU4IQyL1JmrGgJkUig2AJ9EpjARn/gMcZU8omIcxF7LuwVwRe5rwQl\nLrsNQG0yWQl632/5MLqq4JZThclxlAKMaOq5GEn1pjhjlB8J7FMIfKNIzgpal8U7\nzSxDKBy06ev2+pf1Q4fookVrDOgZPQeXJR7+VXBgUQKBgQDuuvt3do+AXFiZkRs+\n5iRR6mk1GnFBPX+4hlciW0RLA7uvdLClDxAnla+szci5mJeDlf0PHd1ux7Bf5Z9X\nso9CT3j64j+a3p7u+PiSE7XPlLhrNxE/gz633KG8jNwE8lzGB6h1ICmo3dpMO6yy\nCEQ9C0SnVAag3JpfzOyprhSbrQKBgQDlUt7KSxk/4gMWYIW+20x0QQBK2PdS+JBS\nwsbHQRmKorf4nzQzRv+rKr0KfwLZeWFCazAL/37VbAOJ4KyP8fxqFFpgz9uelShp\nboSUS0kM/cGlyM+7NKXd3IPBJCEoaLHN7WAkgdIxyMfNjYT9CMYXLNBwoueN8y23\nCJbSAtu7rQKBgEp/GOe/nKo+pvtM98aaBK13S9thZAQqz8diTKCRAG+0O4ZWEKWB\nXNYtdMOk98VK48URMgXcmPPv5o8WVbIFK4VSzXrkzVpjrA8ArHjRI8QiMaZrabt7\nFkBD3ki7YBE/HEpDq4LZRYbHrE5rtMldoQW3lXXt15+tF5NbnGKayx2FAoGBAMv6\nuH0L67utF73xwUWQ3yKRJudssiG1Qvq6kgFuYH+2WRnm0pHB12yzKU+KxkgW9XIU\n0bn6WyEPYN5lYFjxj+nzjKiMevdGCZouWfNmO+Y4WOVUB6KnI9qCaReFQZEl/vIC\n8P/IEeWCiGbIOMCx6zF2BToLTRgwdDtYgn7vV/BJAoGBAL88OTCWVgPP6G3xhk7T\nP8yLn05Or88wX0m3z/2AqWcG6hl1+UF/s8fbMqRszV6dz0mtz70ItBQChvXcCgeF\n2V4pt7K7WBZ3zEGnzXUMhGXnnEAiljEx3xGAzWSjbno52rbNr/1FeudK+v+8D0QI\n3e20gt8TbxLVNmPD9Cr4rMCD\n-----END PRIVATE KEY-----\n',
  clientEmail: 'firebase-adminsdk-jwru7@ubiquitiapp.iam.gserviceaccount.com',
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// if a Firebase instance doesn't exist, create one
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
}

//Rest Api
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
      log.error(error);
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
