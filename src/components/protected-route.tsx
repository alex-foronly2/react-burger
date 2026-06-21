import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/hooks/hooks';
import { userSelector } from '@services/user/slice.js';

import type { JSX } from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: ProtectedRouteProps): JSX.Element => {
  const user = useAppSelector(userSelector);

  const location = useLocation();

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return component;
};
