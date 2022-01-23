import { FC, RefObject, useEffect, useState } from 'react';
import { Box, Text } from 'theme-ui';
import { FiMousePointer } from 'react-icons/fi';
import { Collaborator } from '@utils/types';

const CollaberatorLayer: FC<{
  cardRef: RefObject<HTMLDivElement>;
  collaborators?: Record<string, Collaborator>;
}> = ({ collaborators, cardRef }) => {
  const mice = Object.values(collaborators || {});
  const [rect, setRect] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (cardRef.current) {
      const { width, height } = cardRef.current.getBoundingClientRect();
      setRect({ width, height });
    }
  }, [cardRef.current]);
  return (
    <>
      {mice.map(({ x, y, displayName }) => (
        <Box
          key={`${x}:${y}`}
          sx={{
            position: 'absolute',
            top: y * rect.height,
            left: x * rect.width,
            zIndex: 100,
          }}
        >
          <Text>{displayName}</Text>
          <FiMousePointer />
        </Box>
      ))}
    </>
  );
};

export default CollaberatorLayer;
