import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import db from '@lib/db';
import { Box } from 'theme-ui';
import { useEffect, useState } from 'react';
import TodoCard from '@components/TodoCard';
import * as uuid from 'uuid';
import admin from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from '@lib/clientApp';
import { useRouter } from 'next/router';
import Auth from '@components/Auth';

export async function getServerSideProps({}: GetServerSideProps<{}>) {
  return {
    props: {
      test: true,
      userId: '23423',
    },
  };
}

type ViewSessions = Record<string, TodoSession>;

interface TodoSession {
  collaborators: Record<string, { x: number; y: number }>;
}

export default function Todos({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  // list all todos ,
  // show a form to create todo
  const [todos, setTodos] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [viewSessions, setViewSessions] = useState<ViewSessions>({});
  const [user, loading, error] = useAuthState(firebase.auth());
  console.log(user);
  const router = useRouter();
  useEffect(() => {
    // db.collection('todos').where('ownerId', '==', userId)
    db.collection('todos')
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
        db.collection('sessions')
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
                const currentSession = await db
                  .collection('sessions')
                  .doc(todo.id)
                  .get();
                if (!currentSession.exists) {
                  await db.collection('sessions').doc(todo.id).set({
                    id: todo.id,
                    collaborators: {},
                  });
                }

                await db
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
                const currentSession = await db
                  .collection('sessions')
                  .doc(todo.id)
                  .get();
                if (currentSession.exists) {
                  await db
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
                await db.collection('todos').doc(todo.id).delete();
              }}
              onUpdate={(updatedTodo) => {
                db.collection('todos')
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
}
