import TodosList from '@components/TodoList';
import { getCurrentUser } from '@lib/user';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { currentUser } = await getCurrentUser(
    context.req.cookies,
    context.req.headers
  );
  if (!currentUser) {
    // no current user redirect to login
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    };
  }
  // otherwise pass currentUser to todos list
  return {
    props: {
      currentUser,
    },
  };
}

export default TodosList;
