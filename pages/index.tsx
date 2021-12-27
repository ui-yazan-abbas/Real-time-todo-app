import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import { useEffect, useState } from 'react';
import styles from '@styles/Home.module.css';
import db from '@lib/db';

export async function getServerSideProps({}: GetServerSideProps<{}>) {
  return {
    props: {
      test: true,
      userId: '23423',
    },
  };
}

const Home: NextPage = () => {
  const [todos, setTodos] = useState([]);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    db.collection('todos')
      .get()
      .then((todos) => {
        setTodos(todos.docs.map((doc) => doc.data()) as any);
        console.log(
          ' in get  ',
          todos.docs.map((doc) => doc.data())
        );
      });
    db.collection('todos').onSnapshot((todos) => {
      setTodos(todos.docs.map((doc) => doc.data()) as any);
      console.log(
        ' in snapshot  ',
        todos.docs.map((doc) => doc.data())
      );
    });
    return () => {};
  }, []);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>Ubquiti Todo App</a>
        </h1>
      </main>
    </div>
  );
};

export default Home;
