import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '@lib/firebase';

//Rest Api
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const snapshot = await firebase.database.collection('todos').get();
  const results = snapshot.docs.map((doc) => doc.data());
  res.send(results);
}
