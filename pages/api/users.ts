import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '@lib/firebase';
import { getCurrentUser } from '@lib/user';

export default async function getAllUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(400).json({ Error: 'only GET or POST request are allowed' });
  }

  const { currentUser } = await getCurrentUser(req.cookies, req.headers);
  if (!currentUser) {
    res.status(401).json({ Error: 'unAuthorized Attempt' });
  }

  if (req.method === 'POST') {
    await firebase.database.collection('users').doc().set({
      email: req.body.email,
      displayName: req.body.displayName,
      id: req.body.id,
    });
  }

  const snapshot = await firebase.database.collection('users').get();
  const results = snapshot.docs.map((doc) => doc.data());
  res.json(results);
}
