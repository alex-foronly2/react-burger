import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

export const Layout = () => {
  return (
    <>
      <div>
        <AppHeader />
        <Outlet />
      </div>
    </>
  );
};
