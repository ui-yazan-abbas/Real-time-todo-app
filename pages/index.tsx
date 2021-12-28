import type { NextPage, GetServerSideProps } from 'next';
import styles from '@styles/Home.module.css';
import { Button, Box } from 'theme-ui';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <img className={styles.logo} src='https://i.postimg.cc/CMXRYnwX/logo.png'/>
        <h1 className={styles.title}>
          Welcome to <strong>Ubquiti Todo App</strong>
        </h1>
        <Box>
          <Button onClick={() => router.push('/login')}>Get Started</Button>
        </Box>
      </main>
    </div>
  );
};

export default Home;
