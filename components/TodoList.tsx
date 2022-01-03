import { Box, Button, jsx } from 'theme-ui';
import { FC, useEffect, useState } from 'react';
import TodoCard from '@components/TodoCard';
import { Todo, UserInfo } from '@utils/types';
import { ViewSessions } from '@utils/types';
import { omit } from 'lodash';
import {
  addUserToSession,
  deleteTodo,
  removeUserFromSession,
  subscribeToListChanges,
  subscribeToViewingSesssions,
  updateTodo,
} from '@lib/todos';
import Image from 'next/image';

interface TodosListProps {
  currentUser: UserInfo;
}

const TodosList: FC<TodosListProps> = ({ currentUser }) => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [viewSessions, setViewSessions] = useState<ViewSessions>({});
  const [completed, setCompleted] = useState(false);
  const [emptyState, setEmptyState] = useState(false);
  console.log(' currentUser ', currentUser);
  useEffect(() => {
    return subscribeToListChanges(currentUser, setTodos);
  }, []);

  useEffect(() => {
    return subscribeToViewingSesssions(todos, (sessions) => {
      const sessionsMappedByTodo = sessions.reduce((acc, session) => {
        return {
          ...acc,
          [session.id]: session,
        };
      }, {});
      console.log(' here ', sessions);
      setViewSessions(sessionsMappedByTodo);
    });
  }, [todos]);

  useEffect(() => {
    if (todos?.length === 0) {
      setEmptyState(true);
    } else {
      setEmptyState(false);
    }
  }, [todos]);
  return (
    <Box>
      {!emptyState && (
        <>
          <Button
            sx={{ cursor: 'pointer' }}
            onClick={() => setCompleted((show) => !show)}
          >
            Toggle Done/Undone
          </Button>
          {!completed && (
            <>
              {todos
                ?.filter((i) => !i.completed)
                .map((todo) => (
                  <TodoCard
                    collaborators={omit(
                      viewSessions[todo.id]?.collaborators,
                      currentUser.uid
                    )}
                    onMouseOver={async ({ x, y }) => {
                      addUserToSession(
                        todo.id,
                        currentUser.uid,
                        x,
                        y,
                        currentUser.displayName
                      );
                    }}
                    onMouseLeave={async () => {
                      removeUserFromSession(todo.id, currentUser.uid);
                    }}
                    onDelete={deleteTodo}
                    onUpdate={(draft) => {
                      updateTodo(draft, currentUser.uid);
                    }}
                    key={todo.id}
                    todo={todo}
                  ></TodoCard>
                ))}
            </>
          )}

          {completed && (
            <>
              {todos
                ?.filter((i) => i.completed)
                .map((todo) => (
                  <TodoCard
                    collaborators={omit(
                      viewSessions[todo.id]?.collaborators,
                      currentUser.uid
                    )}
                    onMouseOver={async ({ x, y }) => {
                      addUserToSession(
                        todo.id,
                        currentUser.uid,
                        x,
                        y,
                        currentUser.displayName
                      );
                    }}
                    onMouseLeave={async () => {
                      removeUserFromSession(todo.id, currentUser.uid);
                    }}
                    onDelete={deleteTodo}
                    onUpdate={(draft) => {
                      updateTodo(draft, currentUser.uid);
                    }}
                    key={todo.id}
                    todo={todo}
                  ></TodoCard>
                ))}
            </>
          )}
        </>
      )}

      {emptyState && (
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src="/../public/assets/2.png"
            alt="Profile Icon"
            width={650}
            height={500}
          />
        </Box>
      )}
    </Box>
  );
};

export default TodosList;
