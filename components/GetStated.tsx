import { FC } from "react"
import { Button, Box } from 'theme-ui';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from '@lib/firebase';

const GetStarted: FC = () => {
  const [user] = useAuthState(firebase.auth);
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push('/todos')
    }
    router.push('/login')
  };

  return (
    <div>
      <Box>
        <Button onClick={handleClick}>Get Started</Button>
      </Box>
    </div>
  )
}

export default GetStarted
