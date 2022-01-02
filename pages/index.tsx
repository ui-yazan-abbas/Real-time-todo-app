/** @jsxRuntime classic */
/** @jsx jsx */
import type { NextPage, GetServerSideProps } from 'next';
import styles from '@styles/Home.module.css';
import GetStarted from '@components/GetStated';
import { Box, jsx } from 'theme-ui';

const Home: NextPage = () => {
  return (
    <Box
      sx={{
        padding: '0 2rem',
      }}
    >
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <strong>Ubiquiti Todo App</strong>
        </h1>
        <GetStarted />
      </main>
    </Box>
  );
};

export default Home;
