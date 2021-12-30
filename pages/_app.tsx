import Layout from '@components/Layout';
import '@styles/globals.css';
import type { AppProps } from 'next/app';
import firebase from '@lib/firebase';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    async function fetchToken() {
      const idToken = await firebase.auth.currentUser?.getIdToken();
      if (idToken) {
        Cookies.set('jwt', idToken);
      } else {
        Cookies.remove('jwt');
      }
    }
    fetchToken();
  }, [firebase.auth.currentUser])
  return (
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  );
}

export default MyApp;
