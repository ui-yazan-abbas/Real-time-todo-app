import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import { useEffect, useState } from 'react';
import Layout from '@components/Layout';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@styles/Home.module.css';
import log from '@logger/index';
import db from '@lib/db';
import PageHead from '@components/PageHead';
import { components } from 'theme-ui';

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
Home.Layout = Layout;
