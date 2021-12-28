import { Cross } from '@assets/icons';
import { FC, useState, useEffect, useRef } from 'react';
import { Switch, Box, Card, IconButton } from 'theme-ui';
import RichTextEditor from './RichTextEditor';
import { throttle } from 'lodash';
import CollaberatorLayer from './CollaberatorLayer';

interface Todo {
  completed: boolean;
  title: string;
  description: string;
  locked?: boolean;
  // optional for now
  ownerID?: string;
  id: string;
}

interface Props {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onMouseOver: (cords: { x: number; y: number }) => void;
  onMouseLeave: () => void;
  collaborators?: Record<string, { x: number; y: number }>;
}

const TodoCard: FC<Props> = ({
  todo,
  onUpdate,
  onDelete,
  onMouseOver,
  onMouseLeave,
  collaborators,
}) => {
  return (
    <Card
      onMouseOver={throttle((event: React.MouseEvent<HTMLDivElement>) => {
        onMouseOver({
          x: event.clientX,
          y: event.clientY,
        });
      }, 5)}
      onMouseLeave={throttle(() => onMouseLeave())}
      bg={todo.completed ? '#cfc' : 'yellow'}
      p={4}
      m={4}
      sx={{
        boxShadow: 'none',
        position: 'relative',

        ':hover': {
          boxShadow: '15px 24px 25px -18px rgb(0 0 0 / 40%)',
        },
      }}
    >
      <CollaberatorLayer collaborators={collaborators} />
      <IconButton
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={async () => {
          // todo loading indicator
          // todo test if current user can delete
          onDelete(todo);
        }}
      >
        <Cross />
      </IconButton>
      <Box sx={{ wordWrap: 'break-word' }}>
        <Box
          p={2}
          sx={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}
        >
          {todo.title}
        </Box>
        <Box p={2} sx={{ fontSize: 18 }}>
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
        <Box p={2}>
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
        </Box>
      </Box>
    </Card>
  );
};

export default TodoCard;
