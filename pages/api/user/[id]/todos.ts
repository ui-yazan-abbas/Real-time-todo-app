import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '@lib/firebase';

export default async function getAllTodosByUserId(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const snapshot = await firebase.database.collection('todos').get();
  const results = snapshot.docs
    .map((doc) => doc.data())
    .filter((doc) => doc.ownerId === req.query.id);
  res.json({ id: req.query.id, todos: results });
}
