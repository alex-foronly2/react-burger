import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient.jsx';
import { IngredientModal } from '@components/burger-ingredient/ingredient-modal.jsx';
import { Layout } from '@components/layout/layout';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password.jsx';
import { LoginPage } from '@pages/login/login.jsx';
import { Orders } from '@pages/orders/orders.jsx';
import { ProfileLayout } from '@pages/profile-layout/profile-layout.jsx';
import { ProfilePage } from '@pages/profile/profile.jsx';
import { RegisterPage } from '@pages/register/register.jsx';
import { ResetPasswordPage } from '@pages/reset-password/reset-password.jsx';

import { Home } from './home/home.jsx';
import { NotFound } from './not-found/not-found.jsx';

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
