import firebase from '@lib/firebase';
import { Box } from 'theme-ui';
import { FC, useEffect, useState } from 'react';
import TodoCard from '@components/TodoCard';
import * as uuid from 'uuid';
import admin from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { TodoSession } from '@utils/types';
import { ViewSessions } from '@utils/types';
import { omit } from 'lodash';
import { useRouter } from 'next/router';

const TodosList: FC = () => {
  const [todos, setTodos] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [viewSessions, setViewSessions] = useState<ViewSessions>({});
  const [user, loading, error] = useAuthState(firebase.auth);
  const router = useRouter();
  console.log('todo list',user);

  useEffect(() => {
    firebase.database
      .collection('todos')
      .orderBy('timestamp', 'desc')
      .onSnapshot((todos) => {
        const todosData: any = todos.docs.map((doc) => doc.data());
        setTodos(todosData);
      });
  }, []);

  useEffect(() => {
    console.log('todo list use effect',user);
    if (!user) router.push('/login');
    if (todos) {
      if (!sessionId) {
        setSessionId(uuid.v4());
      }
      todos.forEach((todo: { id: string }) => {
        firebase.database
          .collection('sessions')
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
  return (
    <Box>
      {loading && <h4> loading...</h4>}
      {user && (
        <>
          {todos?.map((todo: any) => (
            <TodoCard
              collaborators={omit(
                viewSessions[todo.id]?.collaborators,
                sessionId
              )}
              onMouseOver={async ({ x, y }) => {
                const currentSession = await firebase.database
                  .collection('sessions')
                  .doc(todo.id)
                  .get();
                if (!currentSession.exists) {
                  await firebase.database
                    .collection('sessions')
                    .doc(todo.id)
                    .set({
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
                    .update({
                      [`collaborators.${sessionId}`]:
                        admin.firestore.FieldValue.delete(),
                    });
                }
              }}
              onDelete={async (todo) => {
                await firebase.database
                  .collection('todos')
                  .doc(todo.id)
                  .delete();
              }}
              onUpdate={(updatedTodo) => {
                firebase.database
                  .collection('todos')
                  .doc(todo.id)
                  .update({
                    ...updatedTodo,
                    updatedAt: Date.now(),
                    updatedBy: sessionId,
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
