import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useLogoutMutation } from '@services/api/authApi';

import styles from './profile-layout.module.css';

export const ProfileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [logout] = useLogoutMutation();
  const logoutHandle = function () {
    const token = localStorage.getItem('refreshToken');
    if (!token) {
      navigate('/');
      return;
    }
    logout({ token });
  };
  return (
    <>
      <div className={`pt-20 pl-4 ${styles.profile}`}>
        <div className={styles.left}>
          <div className={styles.menu}>
            <nav>
              <ul className="">
                <NavLink
                  to={`/profile`}
                  end
                  className={({ isActive }) =>
                    isActive ? styles.activeMenuItem : styles.menuItem
                  }
                >
                  <div className="pt-8">
                    <span className="text text_type_main-default">Профиль</span>
                  </div>
                </NavLink>
                <NavLink
                  to={`/profile/orders`}
                  className={({ isActive }) =>
                    isActive ? styles.activeMenuItem : styles.menuItem
                  }
                >
                  <div className="pt-8">
                    <span className="text text_type_main-default">История заказов</span>
                  </div>
                </NavLink>
                <div className={`${styles.menuItem} pt-8`} onClick={logoutHandle}>
                  <span className="text text_type_main-default">Выход</span>
                </div>
              </ul>
            </nav>
          </div>
          <div className={styles.info}>
            <div className="pt-8">
              <span className="text text_type_main-default">
                {currentPath === '/profile'
                  ? 'В этом разделе вы можете изменить персональные данные'
                  : ''}
              </span>
            </div>
          </div>
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
};
