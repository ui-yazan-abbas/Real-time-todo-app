/** @jsxRuntime classic */
/** @jsx jsx */
import { FC } from 'react';
import { ThemeProvider, jsx } from 'theme-ui';
import Navbar from './Navbar';
import PageHead from './PageHead';
import { sketchy } from '@theme-ui/presets';

const Layout: FC = ({ children }) => {
  return (
    <ThemeProvider theme={sketchy}>
      <PageHead />
      <Navbar />
      <div
        sx={{
          margin: `0 auto`,
          px: 20,
          maxWidth: 800,
          minHeight: 800,
        }}
      >
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
