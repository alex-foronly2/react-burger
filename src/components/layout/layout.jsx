import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import styles from './layour.module.css';

export const Layout = () => {
  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <Outlet />
      </div>
    </>
  );
};
