/** @jsxRuntime classic */
/** @jsx jsx */
import { FC } from 'react';
import Link from 'next/link';
import { Button, jsx, Themed } from 'theme-ui';
import AddTodo from './AddTodo';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from '@lib/firebase';
import { useRouter } from 'next/router';

const Navbar: FC = () => {
  const [user, loading, error] = useAuthState(firebase.auth);
  const router = useRouter();
  console.log('nav bar',user);
  return (
    <Themed.div
      as="header"
      sx={{
        margin: `0 auto`,
        maxWidth: 1920,
        py: 2,
        px: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Themed.div
        sx={{
          display: ['none', 'none', 'flex'],
          flexBasis: 0,
          minWidth: 240,
          justifyContent: 'space-evenly',
        }}
      >
        <Themed.a sx={{ padding: 10, minWidth: 90 }} as={Link} href="/">
          Home
        </Themed.a>
        <Themed.a sx={{ padding: 10, minWidth: 90 }} as={Link} href="/todos">
          Todos
        </Themed.a>
        {!user && (
          <Themed.a sx={{ padding: 10, minWidth: 90 }} as={Link} href="/login">
            Log in
          </Themed.a>
        )}
      </Themed.div>
      <Themed.div
        sx={{
          transform: 'translateX(-50%)',
          left: '50%',
          position: 'absolute',
        }}
      >
        <Themed.h1
          sx={{
            fontSize: 20,
            fontWeight: 'bold',
          }}
        ></Themed.h1>
      </Themed.div>
      {user && (
        <Themed.div
          sx={{
            display: 'flex',
            minWidth: 140,
            width: '100%',
            justifyContent: ['space-between', 'flex-end'],
          }}
        >
          <AddTodo />
          <Button
            sx={{ cursor: 'pointer' }}
            onClick={() => firebase.auth.signOut().then(()=> router.push('/'))}
          >
            Logout
          </Button>
        </Themed.div>
      )}
    </Themed.div>
  );
};

export default Navbar;
