import { FC } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '@lib/clientApp';

// Configure FirebaseUI.
const uiConfig = {
  // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/todos',
  // We will display GitHub as auth providers.
  signInOptions: [firebase.auth.GithubAuthProvider.PROVIDER_ID],
};

const Auth: FC = () => {
  return (
    <div>
      <h1>Ubiquiti Todo App</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
};

export default Auth;
