/** @jsxRuntime classic */
/** @jsx jsx */
import { FC, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Themed, jsx, Message } from 'theme-ui';
import { FiX, FiPlus } from 'react-icons/fi';
import { ExpandModal } from 'react-spring-modal';
import 'react-spring-modal/styles.css';
import TodoForm from './TodoForm';
import { createTodo } from '@lib/todos';

interface AddTodoProps {
  userId: string;
}

const AddTodo: FC<AddTodoProps> = ({ userId }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    setIsOpen(false);
  }, [router.asPath.split('?')[0]]);

  return (
    <>
      <ExpandModal
        transitionConfig={{}}
        contentTransition={{}}
        contentProps={{
          style: {
            maxWidth: 800,
            margin: '0 auto',
            background: 'none',
          },
        }}
        overlayProps={{
          onClick: () => setIsOpen(false),
          style: {
            top: (buttonRef.current?.getBoundingClientRect().bottom || 0) + 15,
          },
        }}
        isOpen={isOpen}
      >
        {message && <Message>{message}</Message>}
        <TodoForm
          onSubmit={async (todo) => {
            setMessage('Creating your todo');
            await createTodo(todo, userId);
            setMessage('Done!');
            setTimeout(() => {
              setMessage('');
              setIsOpen(false);
            }, 300);
          }}
        ></TodoForm>
      </ExpandModal>

      <Themed.div
        sx={{ cursor: 'pointer' }}
        ref={buttonRef}
        as={Button}
        mx={2}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="add"
      >
        {isOpen ? <FiX /> : <FiPlus />}
      </Themed.div>
    </>
  );
};

export default AddTodo;
