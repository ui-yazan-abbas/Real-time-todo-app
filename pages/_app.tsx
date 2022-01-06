import '@styles/globals.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import Layout from '@components/Layout';
import firebase from '@lib/firebase';
import { refreshToken } from '@lib/user';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(firebase.auth);
  useEffect(() => {
    if (!loading) {
      refreshToken();
    }
  }, [user, loading]);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
