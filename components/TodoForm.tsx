import { isValidTodo } from '@lib/todos';
import { Todo } from '@utils/types';
import React, { FC, useState } from 'react';
import { Box, Label, Input, Switch, Button, Card } from 'theme-ui';
import RichTextEditor from './RichTextEditor';
import VisuallyHidden from './VisuallyHidden';
import log from '@logger/index';

interface Props {
  todo?: Todo;
  onSubmit: (value: Todo) => void;
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
          log.info('must at least add a title to create a todo')
        }
      }}
    >
      <VisuallyHidden>
        <Label htmlFor="title">Title</Label>
      </VisuallyHidden>
      <Input
        data-cy="title-input"
        placeholder="Todo Title"
        onChange={(event) => {
          setTodoDraft((draft) => ({
            ...draft,
            title: event.target.value,
          }));
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
          setTodoDraft((draft) => ({
            ...draft,
            description: value,
          }));
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
        <Switch
          mb={3}
          label="Locked"
          onChange={(e) => {
            setTodoDraft({
              ...todoDraft,
              locked: e.target.checked,
            });
          }}
          checked={todoDraft?.locked || false}
        />
      </Box>
      <Button mt={4} data-cy="add-todo-button">
        Add
      </Button>
    </Card>
  );
};

export default TodoForm;
