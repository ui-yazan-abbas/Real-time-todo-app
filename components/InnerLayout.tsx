/** @jsxRuntime classic */
/** @jsx jsx */
import { FC } from 'react';
import { ThemeProvider, jsx } from 'theme-ui';
import themesMap from '@utils/theme';
import Navbar from './Navbar';

const InnerLayout: FC = ({ children }) => {
  return (
    <ThemeProvider theme={themesMap.sketchy}>
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

export default InnerLayout;
