/** @jsxRuntime classic */
/** @jsx jsx */
import { FC } from 'react';
import { ThemeProvider, jsx } from 'theme-ui';
import themesMap from '@utils/theme';

const InnerLayout: FC = ({ children }) => {
  return (
    <ThemeProvider theme={themesMap.sketchy}>
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
