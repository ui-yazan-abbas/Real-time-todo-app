import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '@lib/firebase';

export default async function getUserById(req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await firebase.database.collection('users').get();
  const results = snapshot.docs.map(doc=> doc.data()).filter(doc => doc.uid === req.query.id)
  res.json({uid: req.query.id, user: results})
}
