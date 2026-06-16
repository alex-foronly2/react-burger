import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';
import { IngredientModal } from '@components/burger-ingredient/ingredient-modal.tsx';
import { Layout } from '@components/layout/layout';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password.tsx';
import { LoginPage } from '@pages/login/login.tsx';
import { Orders } from '@pages/orders/orders.tsx';
import { ProfileLayout } from '@pages/profile-layout/profile-layout.tsx';
import { ProfilePage } from '@pages/profile/profile.tsx';
import { RegisterPage } from '@pages/register/register.tsx';
import { ResetPasswordPage } from '@pages/reset-password/reset-password.tsx';

import { Home } from './home/home.tsx';
import { NotFound } from './not-found/not-found.tsx';

export {
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
  BurgerIngredient,
};
