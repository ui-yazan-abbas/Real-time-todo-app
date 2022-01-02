import { FC, RefObject, useEffect, useState } from 'react'
import { Box } from 'theme-ui';
import { Cross } from '@assets/icons';


const CollaberatorLayer: FC<{
  cardRef: RefObject<HTMLDivElement>
  collaborators?: Record<string, { x: number; y: number }>
}> = ({ collaborators, cardRef }) => {
  const mice = Object.values(collaborators || {})
  const [rect, setRect] = useState({ width: 0, height: 0 })
  useEffect(() => {
    if (cardRef.current) {
      const { width, height } = cardRef.current.getBoundingClientRect()
      setRect({ width, height })
    }
  }, [cardRef.current])
  return (
    <>
      {mice.map(({ x, y }) => (
        <Box
          key={`${x}:${y}`}
          sx={{
            position: 'absolute',
            top: y * rect.height,
            left: x * rect.width,
          }}
        >
          <Cross />
        </Box>
      ))}
    </>
  )
}

export default CollaberatorLayer;
