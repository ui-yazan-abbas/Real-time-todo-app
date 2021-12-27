import { FC } from 'react';
import { Box } from 'theme-ui';
import { Plus } from '@assets/icons';

const CollaberatorLayer: FC<{
  collaborators?: Record<string, { x: number; y: number }>;
}> = ({ collaborators }) => {
  const mice = Object.values(collaborators || {});
  return (
    <Box>
      {mice.map(({ x, y }) => (
        <Box
          key={`${x}:${y}`}
          sx={{
            position: 'absolute',
            top: y,
            left: x,
          }}
        >
          <Plus />
        </Box>
      ))}
    </Box>
  );
};

export default CollaberatorLayer;
