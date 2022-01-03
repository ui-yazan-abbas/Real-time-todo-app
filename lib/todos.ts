import { Todo, TodoSession, UserInfo } from '@utils/types';
import firebase from './firebase';
import firebaseApp from 'firebase/app';
import * as uuid from 'uuid';

export function isValidTodo(todo: Partial<Todo>): todo is Todo {
  return typeof todo.title !== 'undefined';
}

export function isValidTodoSession(
  session: Partial<TodoSession>
): session is TodoSession {
  return typeof session.collaborators !== 'undefined';
}

export function subscribeToTodoChanges(
  todoId: string,
  callback: (todo: Todo) => void
) {
  return firebase.database
    .collection('todos')
    .doc(todoId)
    .onSnapshot((latestTodo) => {
      const data = latestTodo.data();
      if (data && isValidTodo(data)) {
        callback(data);
      }
    });
}

export function subscribeToListChanges(
  currentUser: UserInfo,
  callback: (todos: Todo[]) => void
) {
  return firebase.database
    .collection('todos')
    .where('ownerId', '==', currentUser.uid)
    .onSnapshot((todos) => {
      const todosData = todos.docs.map((doc) => doc.data()).filter(isValidTodo);
      callback(todosData);
    });
}

export function subscribeToViewingSesssions(
  todos: Todo[],
  callback: (sessions: TodoSession[]) => void
) {
  if (todos.length > 0) {
    return firebase.database
      .collection('sessions')
      .where(
        'id',
        'in',
        todos.map((todo) => todo.id)
      )
      .onSnapshot((sessions) => {
        const sessionsData = sessions.docs
          .map((doc) => doc.data())
          .filter(isValidTodoSession);
        callback(sessionsData);
      });
  }
}

export function createTodo(todo: Todo, userId: string) {
  const id = uuid.v4();
  return firebase.database
    .collection('todos')
    .doc(id)
    .set({
      ...todo,
      id,
      ownerId: userId,
    });
}
export function updateTodo(todo: Todo, userId: string) {
  return firebase.database
    .collection('todos')
    .doc(todo.id)
    .update({
      ...todo,
      updatedAt: Date.now(),
      updatedBy: userId,
    });
}

export function deleteTodo(todo: Todo) {
  return firebase.database.collection('todos').doc(todo.id).delete();
}

export async function removeUserFromSession(todoId: string, userId: string) {
  const currentSession = await firebase.database
    .collection('sessions')
    .doc(todoId)
    .get();
  if (currentSession.exists) {
    await firebase.database
      .collection('sessions')
      .doc(todoId)
      .update({
        [`collaborators.${userId}`]: firebaseApp.firestore.FieldValue.delete(),
      });
  }
}

export async function addUserToSession(
  todoId: string,
  userId: string,
  x: number,
  y: number,
  displayName: string
) {
  const currentSession = await firebase.database
    .collection('sessions')
    .doc(todoId)
    .get();
  if (currentSession.exists) {
    await firebase.database
      .collection('sessions')
      .doc(todoId)
      .update({
        // dotted updates
        [`collaborators.${userId}`]: { x, y, displayName },
      });
  } else {
    await firebase.database
      .collection('sessions')
      .doc(todoId)
      .set({
        id: todoId,
        collaborators: {
          [userId]: { x, y, displayName },
        },
      });
  }
}
