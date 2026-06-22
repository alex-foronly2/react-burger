import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, Link } from 'react-router-dom';

import type { JSX } from 'react';

import styles from './app-header.module.css';

export const AppHeader = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to={'/'}
            className={({ isActive }) =>
              isActive ? styles.link + ' ' + styles.link_active : styles.link
            }
          >
            <BurgerIcon type="primary" />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>
          <NavLink
            to={'/feed'}
            className={({ isActive }) =>
              isActive
                ? styles.link + ' ml-10 ' + styles.link_active
                : 'ml-10 ' + styles.link
            }
          >
            <ListIcon type="secondary" />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <Link to="/">
          <div className={styles.logo}>
            <Logo />
          </div>
        </Link>
        <NavLink
          to={'/profile'}
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.link_active} ${styles.link_position_last}`
              : `${styles.link} ${styles.link_position_last}`
          }
        >
          <ProfileIcon type="secondary" />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </NavLink>
      </nav>
    </header>
  );
};
