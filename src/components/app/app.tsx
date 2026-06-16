import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import {
  Home,
  NotFound,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ProfilePage,
  ProfileLayout,
  Orders,
  Layout,
  IngredientModal,
} from '@/pages';
import { ProtectedRoute } from '@components/protected-route';

import type { JSX } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
        // loader: async () => ({ ingredientsData: loadIngredients() }),
        children: [
          {
            path: '/ingredients',
            // element: <BurgerIngredient />,
            element: <IngredientModal />,
            children: [
              {
                path: ':ingredientId',
                element: <IngredientModal />,
              },
            ],
          },
        ],
      },
      {
        path: '/login',
        element: <ProtectedRoute onlyUnAuth component={<LoginPage />} />,
      },
      {
        path: '/register',
        element: <ProtectedRoute onlyUnAuth component={<RegisterPage />} />,
      },
      {
        path: '/forgot-password',
        element: <ProtectedRoute onlyUnAuth component={<ForgotPasswordPage />} />,
      },
      {
        path: '/reset-password',
        element: <ProtectedRoute onlyUnAuth component={<ResetPasswordPage />} />,
      },
      {
        path: '/profile',
        element: <ProtectedRoute component={<ProfileLayout />} />,
        children: [
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: 'orders',
            element: <Orders />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export function App(): JSX.Element {
  return <RouterProvider router={router} />;
}
