/** @jsxRuntime classic */
/** @jsx jsx */
import { FC } from 'react';
import Link from 'next/link';
import { jsx, Themed } from 'theme-ui';
import AddTodo from './AddTodo';

const Navbar: FC = () => {
  return (
    <Themed.div
      as="header"
      sx={{
        margin: `0 auto`,
        maxWidth: 1920,
        py: 2,
        px: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Themed.div
        sx={{
          display: ['none', 'none', 'flex'],
          flexBasis: 0,
          minWidth: 240,
          justifyContent: 'space-evenly',
        }}
      >
        <Themed.a sx={{ padding: 10, minWidth: 90 }} as={Link} href="/">
          Home
        </Themed.a>
        <Themed.a sx={{ padding: 10, minWidth: 90 }} as={Link} href="/todos">
          Todos
        </Themed.a>
        <Themed.a sx={{ padding: 10, minWidth: 90 }} as={Link} href="/login">
          Log in
        </Themed.a>
      </Themed.div>
      <Themed.div
        sx={{
          transform: 'translateX(-50%)',
          left: '50%',
          position: 'absolute',
        }}
      >
        <Themed.h1
          sx={{
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          <Themed.a
            as={Link}
            href="/"
            sx={{
              letterSpacing: -1,
              textDecoration: `none`,
              paddingLeft: '5px',
            }}
          >
            TODO APP
          </Themed.a>
        </Themed.h1>
      </Themed.div>
      <Themed.div
        sx={{
          display: 'flex',
          minWidth: 140,
          width: '100%',
          justifyContent: ['space-between', 'flex-end'],
        }}
      >
        <AddTodo />
      </Themed.div>
    </Themed.div>
  );
};

export default Navbar;
