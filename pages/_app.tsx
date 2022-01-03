import '@styles/globals.css';
import Layout from '@components/Layout';
import type { AppProps } from 'next/app';
import firebase from '@lib/firebase';
import { useEffect } from 'react';
import { refreshToken } from '@lib/user';
import { useAuthState } from 'react-firebase-hooks/auth';

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
