import { FC } from 'react';
import { Label, Input, Checkbox, Box, Button } from 'theme-ui';

const LoginForm: FC = () => {
  return (
    <Box as="form" onSubmit={(e) => e.preventDefault()}>
      <h1>Log In</h1>
      <Label htmlFor="username">Username</Label>
      <Input name="username" id="username" mb={3} />
      <Label htmlFor="password">Password</Label>
      <Input type="password" name="password" id="password" mb={3} />
      <Box>
        <Label mb={3}>
          <Checkbox />
          Remember me
        </Label>
      </Box>
      <Button>Submit</Button>
    </Box>
  );
};

export default LoginForm;
