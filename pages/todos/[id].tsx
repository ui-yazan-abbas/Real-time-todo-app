import { Todo, TodoSession, UserInfo } from '@utils/types';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import firebase from '@lib/firebase';
import TodoCard from '@components/TodoCard';
import { Box } from 'theme-ui';
import { omit } from 'lodash';

async function getCurrentUser(context: GetServerSidePropsContext) {
  const jwt = context.req.cookies.jwt;

  // absolute urls are required by nextjs ,https://stackoverflow.com/a/65556668/3109205
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${context.req.headers.host}`;

  const currentUserResponse = await fetch(`${baseUrl}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  }).then((res) => res.json());

  return {
    currentUser: currentUserResponse.currentUser,
  };
}

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  // if user is signed in
  const { currentUser } = await getCurrentUser(context);
  if (!currentUser) {
    // no current user redirect to login
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  return {
    props: {
      currentUser,
    },
  };
}
interface TodoPageProps {
  currentUser: UserInfo;
}

// todo export this from lib/firestore

export default function TodoPage(props: TodoPageProps) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo>();
  useEffect(() => {
    const todoId = router.query.id;
    if (typeof todoId === 'string') {
      firebase.database
        .collection('todos')
        .doc(todoId)
        .onSnapshot((latestTodo) => {
          const data = latestTodo.data();
          if (latestTodo.exists && data) {
            setTodo(data as Todo);
          }
        });
    }
  }, [router.query.id]);

  const [viewSession, setViewSession] = useState<TodoSession>();

  useEffect(() => {
    if (todo) {
      firebase.database
        .collection('sessions')
        .doc(todo.id)
        .onSnapshot((session) => {
          setViewSession(session.data() as TodoSession);
        });
    }
  }, [todo]);

  return (
    <Box>
      {todo && (
       <TodoCard
       collaborators={omit(
         viewSession?.collaborators,
         props.currentUser.uid
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
              [props.currentUser.uid]: { x, y },
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
                    [props.currentUser.uid]:
                      firebase.firebase.firestore.FieldValue.delete(),
                  },
                },
                { merge: true }
              );
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
             updatedBy: props.currentUser.uid,
           });
       }}
       key={todo.id}
       todo={todo}
     ></TodoCard>
      )}
    </Box>
  );
}
