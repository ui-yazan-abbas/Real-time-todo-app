import { FC } from 'react';
import Head from 'next/head';

const PageHead: FC = () => {
  return (
    <Head>
      <title>Todo App</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href="https://i.postimg.cc/TY9y2jw9/3.png" />
    </Head>
  );
};

export default PageHead;
