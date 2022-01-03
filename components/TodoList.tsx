import firebase from '@lib/firebase';
import { Box } from 'theme-ui';
import { FC, useEffect, useState } from 'react';
import TodoCard from '@components/TodoCard';
import * as uuid from 'uuid';
import admin from 'firebase/app';
import { Todo, TodoSession, UserInfo } from '@utils/types';
import { ViewSessions } from '@utils/types';
import { omit } from 'lodash';

interface TodosListProps {
  currentUser: UserInfo;
}

const TodosList: FC<TodosListProps> = ({ currentUser }) => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [viewSessions, setViewSessions] = useState<ViewSessions>({});

  useEffect(() => {
    firebase.database
      .collection('todos')
      .where('ownerId', '==', currentUser.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot((todos) => {
        const todosData: any = todos.docs.map((doc) => doc.data());
        setTodos(todosData);
      });
  }, []);

  useEffect(() => {
    if (todos) {
      todos.forEach((todo: { id: string }) => {
        firebase.database
          .collection('sessions')
          .doc(todo.id)
          .onSnapshot((session) => {
            setViewSessions((oldValue) => {
              const sessionData = session.data();
              if (sessionData) {
                return {
                  ...oldValue,
                  [todo.id]: session.data() as TodoSession,
                };
              }
              delete oldValue[todo.id];
              return oldValue;
            });
          });
      });
    }
  }, [todos]);
  return (
    <Box>
      {todos?.map((todo) => (
        <TodoCard
          collaborators={omit(
            viewSessions[todo.id]?.collaborators,
            currentUser.uid
          )}
          onMouseOver={async ({ x, y }) => {
            const currentSession = await firebase.database
              .collection('sessions')
              .doc(todo.id)
              .get();
            if (!currentSession.exists) {
              await firebase.database.collection('sessions').doc(todo.id).set({
                id: todo.id,
                collaborators: {},
              });
            }

            await firebase.database
              .collection('sessions')
              .doc(todo.id)
              .update({
                collaborators: {
                  [currentUser.uid]: { x, y },
                },
              });
          }}
          onMouseLeave={async () => {
            // dotted updates
            const currentSession = await firebase.database
              .collection('sessions')
              .doc(todo.id)
              .get();
            if (currentSession.exists) {
              await firebase.database
                .collection('sessions')
                .doc(todo.id)
                .update({
                  [`collaborators.${currentUser.uid}`]:
                    admin.firestore.FieldValue.delete(),
                });
            }
          }}
          onDelete={async (todo) => {
            await firebase.database.collection('todos').doc(todo.id).delete();
          }}
          onUpdate={(updatedTodo) => {
            firebase.database
              .collection('todos')
              .doc(todo.id)
              .update({
                ...updatedTodo,
                updatedAt: Date.now(),
                updatedBy: currentUser.uid,
              });
          }}
          key={todo.id}
          todo={todo}
        ></TodoCard>
      ))}
    </Box>
  );
};

export default TodosList;
