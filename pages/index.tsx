/** @jsxRuntime classic */
/** @jsx jsx */
import type { NextPage } from 'next';
import GetStarted from '@components/GetStarted';
import { Box, Heading, jsx } from 'theme-ui';

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
      <Heading sx={{
        padding: '2rem',
        fontSize: '40px'
      }}>  Welcome to <Heading sx={{
        color: '#6c9ed8'
      }}>Ubiquiti Todo App</Heading></Heading>

      <GetStarted />
    </Box >
  );
};

export default Home;
