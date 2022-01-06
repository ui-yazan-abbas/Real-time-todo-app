import { FiX } from 'react-icons/fi';
import { FC, useEffect, useRef, useState, useMemo } from 'react';
import { Switch, Box, Card, IconButton, Text } from 'theme-ui';
import RichTextEditor from './RichTextEditor';
import { throttle } from 'lodash';
import { Collaborator, Todo } from '@utils/types';
import Link from 'next/link';
import ShareLink from './ShareLink';
import CollaberatorLayer from './CollaberatorLayer';

interface Props {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onMouseOver: (cords: { x: number; y: number }) => void;
  onMouseLeave: () => void;
  collaborators?: Record<string, Collaborator>;
}

const TodoCard: FC<Props> = ({
  todo,
  onUpdate,
  onDelete,
  onMouseOver,
  onMouseLeave,
  collaborators,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [lock, setLock] = useState(false);
  const broadcastMousLocation = useMemo(
    () =>
      throttle((event: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (event.clientX - rect.left) / rect.width; //x position within the element.
          const y = (event.clientY - rect.top) / rect.height; //y position within the element.
          onMouseOver({
            x,
            y,
          });
        }
      }, 150),
    [cardRef.current]
  );

  useEffect(() => {
    const hasCollaborators = Object.keys(collaborators || {}).length > 0;
    if (hasCollaborators) {
      setBackgroundColor('lightBlue');
    } else if (todo.locked) {
      setBackgroundColor('gray');
    } else {
      setBackgroundColor(todo.completed ? '#cfc' : 'yellow');
    }
  }, [collaborators, todo]);

  useEffect(() => {
    if (todo.locked) {
      setLock(true);
      setBackgroundColor('gray');
    } else {
      setLock(false);
    }
  }, [todo]);
  return (
    <>
      {lock && (
        <Card bg={backgroundColor} p={3} m={4}>
          <Box
            data-cy="todo-card"
            p={2}
            sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}
          >
            {todo.title}
          </Box>
          <Box p={2} sx={{ fontSize: 18 }}>
            <Text>{todo.description}</Text>
          </Box>
          <Box p={2} data-cy="lock-button">
            <Switch
              label="locked"
              checked={todo.locked}
              onChange={(event) => {
                onUpdate({
                  ...todo,
                  locked: event.target.checked,
                });
              }}
            ></Switch>
          </Box>
        </Card>
      )}
      {!lock && (
        <Card
          ref={cardRef}
          onMouseMove={broadcastMousLocation}
          onMouseLeave={throttle(onMouseLeave, 100, { leading: false })}
          bg={backgroundColor}
          p={3}
          m={4}
          sx={{
            boxShadow: 'none',
            position: 'relative',
            ':hover': {
              boxShadow: '15px 24px 25px -18px rgb(0 0 0 / 40%)',
            },
          }}
        >
          <CollaberatorLayer cardRef={cardRef} collaborators={collaborators} />
          <IconButton
            sx={{ cursor: 'pointer', position: 'absolute', top: 10, right: 10 }}
            onClick={async () => {
              // todo loading indicator
              // todo test if current user can delete
              onDelete(todo);
            }}
            data-cy="delete-button"
          >
            <FiX />
          </IconButton>
          <Box sx={{ wordWrap: 'break-word' }}>
            <Box
              p={2}
              sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}
            >
              <Link href={`/todos/${todo.id}`}>{todo.title}</Link>
            </Box>
            <Box p={2} sx={{ fontSize: 18 }} data-cy="description-space">
              <RichTextEditor
                onChange={(newDescription) => {
                  onUpdate({
                    ...todo,
                    description: newDescription,
                  });
                }}
                value={todo.description}
              />
            </Box>
            <Box p={2} data-cy="switches">
              <Switch
                label="completed"
                checked={todo.completed}
                onChange={(event) => {
                  onUpdate({
                    ...todo,
                    completed: event.target.checked,
                  });
                }}
              ></Switch>
              <Switch
                label="locked"
                checked={todo.locked}
                onChange={(event) => {
                  onUpdate({
                    ...todo,
                    locked: event.target.checked,
                  });
                }}
              ></Switch>
            </Box>
          </Box>
          <ShareLink id={todo.id} />
        </Card>
      )}
    </>
  );
};

export default TodoCard;
