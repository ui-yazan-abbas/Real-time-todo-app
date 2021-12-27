/** @jsxRuntime classic */
/** @jsx jsx */
import React, { FC, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Themed, jsx, Message } from 'theme-ui';
import { Cross, Plus } from '@assets/icons';
import { ExpandModal } from 'react-spring-modal';
import 'react-spring-modal/styles.css';
import TodoForm from './TodoForm';
import * as uuid from 'uuid';
import db from '@lib/db';

interface Props {
  className?: string;
  id?: string;
}

const AddTodo: FC<Props> = () => {
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
            const id = uuid.v4();
            setMessage('Creating your todo');
            await db
              .collection('todos')
              .doc(id)
              .set({
                ...todo,
                id,
                timestamp: Date.now(),
              });
            setMessage('Done!');
            setTimeout(() => {
              setMessage('');
              setIsOpen(false);
            }, 300);
          }}
        ></TodoForm>
      </ExpandModal>

      <Themed.div
        ref={buttonRef}
        as={Button}
        mx={2}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="add"
      >
        {isOpen ? <Cross /> : <Plus />}
      </Themed.div>
    </>
  );
};

export default AddTodo;
