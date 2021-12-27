import React, { FC, useState } from 'react';
import { Box, Label, Input, Switch, Button, Card } from 'theme-ui';
import RichTextEditor from './RichTextEditor';
import VisuallyHidden from './VisuallyHidden';
interface Todo {
  completed: boolean;
  title: string;
  description: string;
  locked?: boolean;
  // optional for now
  ownerID?: string;
}

interface Props {
  todo?: Todo;
  onSubmit: (value: Todo) => void;
}

function isValidTodo(todo: Partial<Todo>): todo is Todo {
  return typeof todo.title !== 'undefined';
}

const TodoForm: FC<Props> = ({ todo: initialState, onSubmit }) => {
  const [todoDraft, setTodoDraft] = useState<Partial<Todo>>(initialState || {});

  return (
    <Card
      bg="yellow"
      p={4}
      sx={{
        boxShadow: 'none',

        ':hover': {
          boxShadow: '15px 24px 25px -18px rgb(0 0 0 / 40%)',
        },
      }}
      as="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (isValidTodo(todoDraft)) {
          onSubmit(todoDraft);
          setTodoDraft({});
        } else {
          // invalid, prompt for a title
        }
      }}
    >
      <VisuallyHidden>
        <Label htmlFor="title">Title</Label>
      </VisuallyHidden>
      <Input
        placeholder="Todo Title"
        onChange={(e) => {
          setTodoDraft({
            ...todoDraft,
            title: e.target.value,
          });
        }}
        defaultValue={todoDraft?.title}
        name="title"
        id="title"
        mb={3}
      />

      <VisuallyHidden>
        <Label htmlFor="description">Description</Label>
      </VisuallyHidden>
      <RichTextEditor
        onChange={(value) => {
          setTodoDraft({
            ...todoDraft,
            description: value,
          });
        }}
        value={todoDraft?.description || ''}
      />
      <Box>
        <Switch
          mb={3}
          label="Completed"
          onChange={(e) => {
            setTodoDraft({
              ...todoDraft,
              completed: e.target.checked,
            });
          }}
          checked={todoDraft?.completed || false}
        />
      </Box>
      <Button mt={4}>Add</Button>
    </Card>
  );
};

export default TodoForm;
