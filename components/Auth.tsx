import { FC } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '@lib/firebase';
import { UserInfo } from '@utils/types';
import { useRouter } from 'next/router';

const Auth: FC = () => {
  const router = useRouter();
  
  const onSuccessfulSignin = async (userInfo: UserInfo) => {
    const { email, displayName , uid } = userInfo;
    await firebase.database.collection('users').doc(uid).set({
      email, displayName , uid, id: uid,
    });
  }

  return (
    <div>
      <h1>Ubiquiti Todo App</h1>
      <StyledFirebaseAuth uiConfig={{
        // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        // display GitHub as auth providers.
        signInSuccessUrl: '/todos',
        signInOptions: [firebase.githubAuth, firebase.googleAuth],
        callbacks: {
          
          signInSuccessWithAuthResult(result) {
            onSuccessfulSignin(result.user)
            return false;
          }
        }
      }} firebaseAuth={firebase.auth} />
    </div>
  );
};

export default Auth;
