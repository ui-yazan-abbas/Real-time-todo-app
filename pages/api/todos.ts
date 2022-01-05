import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '@lib/firebase';

//Rest Api
export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(400).json({ Error: 'bad request' });
  }

  if (req.method === 'POST') {
    await firebase.database.collection('todos').doc().set({
      title: req.body.title,
      description: req.body.description,
      id: req.body.id,
      ownerId: req.body.ownerId,
    });
  }

  const snapshot = await firebase.database.collection('todos').get();
  const results = snapshot.docs.map((doc) => doc.data());
  res.json(results);
}
