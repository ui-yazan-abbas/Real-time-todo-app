import { FC } from 'react';
import InnerLayout from './InnerLayout';
import PageHead from './PageHead';

const Layout: FC = ({ children }) => {
  return (
    <>
      <PageHead />
      <InnerLayout children={children} />
    </>
  );
};

export default Layout;
