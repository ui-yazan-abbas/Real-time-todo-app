import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '@lib/firebase';
import { getCurrentUser } from '@lib/user';

export default async function getUserById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { currentUser } = await getCurrentUser(req.cookies, req.headers);
  if (!currentUser) {
    res.status(401).json({ Error: 'unAuthorized Attempt' });
  }

  if (req.method !== 'GET') {
    res.status(400).json({ Error: 'only GET request are allowed' });
  }

  const snapshot = await firebase.database.collection('users').get();
  const results = snapshot.docs
    .map((doc) => doc.data())
    .filter((doc) => doc.uid === req.query.id);
  res.json({ uid: req.query.id, user: results });
}
