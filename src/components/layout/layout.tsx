import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import type { JSX } from 'react';

import styles from './layout.module.css';

export const Layout = (): JSX.Element => {
  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <Outlet />
      </div>
    </>
  );
};
