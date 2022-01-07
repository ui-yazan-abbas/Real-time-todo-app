/** @jsxRuntime classic */
/** @jsx jsx */
import { FC } from 'react';
import Link from 'next/link'
import { Button, jsx, Themed } from 'theme-ui';
import AddTodo from './AddTodo';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from '@lib/firebase';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Navbar: FC = () => {
  const [user] = useAuthState(firebase.auth);
  const router = useRouter();

  return (
    <Themed.div
      as="header"
      sx={{
        margin: `0 auto`,
        maxWidth: 1920,
        minHeight: 60,
        py: 2,
        px: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {user && (
        <Themed.div
          sx={{
            display: 'flex',
            minWidth: 140,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div data-cy="plus-sign">
            <AddTodo userId={user.uid} />
          </div>
          <Button
            data-cy="logout-button"
            sx={{ cursor: 'pointer' }}
            onClick={() =>
              firebase.auth.signOut().then(() => {
                Cookies.remove('jwt');
                router.push('/');
              })
            }
          >
            Logout
          </Button>
        </Themed.div>
      )}
    </Themed.div>
  );
};

export default Navbar;
