import { Todo, TodoSession, UserInfo } from '@utils/types';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import firebase from '@lib/firebase';
import TodoCard from '@components/TodoCard';
import { Box } from 'theme-ui';
import { omit } from 'lodash';
import { getCurrentUser } from '@lib/user';
import Link from 'next/link';
import {
  addUserToSession,
  deleteTodo,
  removeUserFromSession,
  subscribeToTodoChanges,
  subscribeToViewingSesssions,
  updateTodo,
} from '@lib/todos';

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  // if user is signed in
  const { currentUser } = await getCurrentUser(
    context.req.cookies,
    context.req.headers
  );
  if (!currentUser) {
    // no current user redirect to login
    return {
      redirect: {
        permanent: false,
        destination: `/login?returnTo=${encodeURIComponent(
          context.req.url || ''
        )}`,
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
      return subscribeToTodoChanges(todoId, setTodo);
    }
  }, [router.query.id]);

  const [viewSession, setViewSession] = useState<TodoSession>();

  useEffect(() => {
    if (todo) {
      subscribeToViewingSesssions([todo], (sessions) =>
        setViewSession(sessions[0])
      );
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
            addUserToSession(
              todo.id,
              props.currentUser.uid,
              x,
              y,
              props.currentUser.displayName || props.currentUser.email
            );
          }}
          onMouseLeave={async () => {
            removeUserFromSession(todo.id, props.currentUser.uid);
          }}
          onDelete={deleteTodo}
          onUpdate={(draft) => {
            updateTodo(draft, props.currentUser.uid);
          }}
          key={todo.id}
          todo={todo}
        ></TodoCard>
      )}
      <Link href="/"><a>&lt;-- back to the main page</a></Link>

    </Box>
  );
}
