import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '@lib/firebase';

export default async function getAllUsers (req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await firebase.database.collection('users').get();
  const results = snapshot.docs.map((doc) => doc.data());
  res.json(results);
}
