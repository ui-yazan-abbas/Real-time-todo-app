import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { NextPage } from 'next';
import firebase from '@lib/firebase';
import { UserInfo } from '@utils/types';
import { useRouter } from 'next/router';
import { Box, Heading } from 'theme-ui';

const login: NextPage = () => {
  const router = useRouter();

  const onSuccessfulSignin = async (userInfo: UserInfo) => {
    const { email, displayName, uid } = userInfo;
    router.push('/todos');
    await firebase.database.collection('users').doc(uid).set({
      email,
      displayName,
      uid,
      id: uid,
    });
  };

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
      <StyledFirebaseAuth
        uiConfig={{
          // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function or I can use them both
          // display GitHub as auth providers.
          signInSuccessUrl: '/todos',
          signInOptions: [
            firebase.githubAuth,
            firebase.googleAuth,
          ],
          callbacks: {
            signInSuccessWithAuthResult(result) {
              onSuccessfulSignin(result.user);
              return false;
            },
          },
        }}
        firebaseAuth={firebase.auth}
      />
    </Box>
  );
};

export default login;
