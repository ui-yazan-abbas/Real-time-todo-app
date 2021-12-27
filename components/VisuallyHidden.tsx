import { FC } from 'react';
import { Box } from 'theme-ui';

const VisuallyHidden: FC = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        position: 'absolute',
        overflow: 'hidden',
        clip: 'rect(0 0 0 0)',
        height: 1,
        width: 1,
        margin: -1,
        padding: 0,
        border: 0,
      }}
    >
      {children}
    </Box>
  );
};
export default VisuallyHidden;
