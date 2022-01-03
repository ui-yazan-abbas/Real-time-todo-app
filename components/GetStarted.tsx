import { FC } from 'react';
import { Button, Box } from 'theme-ui';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from '@lib/firebase';

const GetStarted: FC = () => {
  const [user] = useAuthState(firebase.auth);
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push('/todos');
    } else {
      router.push('/login');
    }
  };

  return (
    <Box>
      <Button sx={{ cursor: 'pointer' }} onClick={handleClick}>
        Get Started
      </Button>
    </Box>
  );
};

export default GetStarted;
