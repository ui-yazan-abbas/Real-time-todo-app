import firebase from '@lib/firebase';
import { Box } from 'theme-ui';
import { FC, useEffect, useState } from 'react';
import TodoCard from '@components/TodoCard';
import * as uuid from 'uuid';
import admin from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import Auth from '@components/Auth';
import { TodoSession } from '@utils/types';
import { ViewSessions } from '@utils/types';


const TodosList: FC = () => {
  // list all todos,
  const [todos, setTodos] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [viewSessions, setViewSessions] = useState<ViewSessions>({});
  const [user, loading, error] = useAuthState(firebase.auth);
  useEffect(() => {
    // db.collection('todos').where('ownerId', '==', userId)
    firebase.database.collection('todos')
      .orderBy('timestamp', 'desc')
      .onSnapshot((todos) => {
        // TODO update type to TODO[]
        const todosData: any = todos.docs.map((doc) => doc.data());
        setTodos(todosData);
      });
  }, []);

  useEffect(() => {
    if (todos) {
      if (!sessionId) {
        setSessionId(uuid.v4());
      }

      todos.forEach((todo: { id: string }) => {
        firebase.database.collection('sessions')
          .doc(todo.id)
          .onSnapshot((session) => {
            setViewSessions((oldValue) => {
              const sessionData = session.data();
              if (sessionData) {
                return {
                  ...oldValue,
                  [todo.id]: session.data() as TodoSession,
                };
              }
              delete oldValue[todo.id];
              return oldValue;
            });
          });
      });
    }
  }, [todos]);

  useEffect(() => {}, [viewSessions]);
  return (
    <Box>
      {loading && <h4> loading...</h4>}
      {!user && <Auth />}
      {user && (
        <>
          {todos?.map((todo: any) => (
            <TodoCard
              collaborators={viewSessions[todo.id]?.collaborators}
              onMouseOver={async ({ x, y }) => {
                const currentSession = await firebase.database
                  .collection('sessions')
                  .doc(todo.id)
                  .get();
                if (!currentSession.exists) {
                  await firebase.database.collection('sessions').doc(todo.id).set({
                    id: todo.id,
                    collaborators: {},
                  });
                }

                await firebase.database
                  .collection('sessions')
                  .doc(todo.id)
                  .update({
                    collaborators: {
                      [sessionId]: { x, y },
                    },
                  });
              }}
              onMouseLeave={async () => {
                // dotted updates
                const currentSession = await firebase.database
                  .collection('sessions')
                  .doc(todo.id)
                  .get();
                if (currentSession.exists) {
                  await firebase.database
                    .collection('sessions')
                    .doc(todo.id)
                    .set(
                      {
                        collaborators: {
                          [sessionId]: admin.firestore.FieldValue.delete(),
                        },
                      },
                      { merge: true }
                    );
                }
              }}
              onDelete={async (todo) => {
                await firebase.database.collection('todos').doc(todo.id).delete();
              }}
              onUpdate={(updatedTodo) => {
                firebase.database.collection('todos')
                  .doc(todo.id)
                  .update({
                    ...updatedTodo,
                    updatedAt: Date.now(),
                  });
              }}
              key={todo.id}
              todo={todo}
            ></TodoCard>
          ))}
        </>
      )}
    </Box>
  );
};

export default TodosList;
