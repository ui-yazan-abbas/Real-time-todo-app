/** @jsxRuntime classic */
/** @jsx jsx */
import type { GetServerSidePropsContext, NextPage } from 'next';
import GetStarted from '@components/GetStarted';
import { Box, Heading, jsx, Text } from 'theme-ui';
import { getCurrentUser } from '@lib/user';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // if user is signed in
  const { currentUser } = await getCurrentUser(
    context.req.cookies,
    context.req.headers
  );
  if (!currentUser) {
    // no current user show home page
    return { props: {} };
  }
  // user already logged in , go to todos
  return {
    redirect: {
      permanent: false,
      destination: '/todos',
    },
  };
}

const Home: NextPage = () => {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Heading
        sx={{
          padding: '2rem',
          fontSize: '40px',
        }}
      >
        Welcome to <br />
        <Text
          sx={{
            color: '#6c9ed8',
            fontSize: '50px',
          }}
        >
          Todo App
        </Text>
      </Heading>

      <GetStarted />
    </Box>
  );
};

export default Home;
