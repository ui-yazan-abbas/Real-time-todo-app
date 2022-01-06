import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '@lib/firebase';
import { getCurrentUser } from '@lib/user';

export default async function getAllTodosByUserId(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { currentUser } = await getCurrentUser(
    req.cookies,
    req.headers
  );
  if (!currentUser) {
    res.status(401).json({Error: 'unAuthorized Attempt'})
  }

  if(req.method !== 'GET'){
    res.status(400).json({ Error: 'only GET request are allowed' });
  }

  const snapshot = await firebase.database.collection('todos').get();
  const results = snapshot.docs
    .map((doc) => doc.data())
    .filter((doc) => doc.ownerId === req.query.id);
  res.json({ id: req.query.id, todos: results });
}
