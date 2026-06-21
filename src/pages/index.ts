import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';
import { IngredientModal } from '@components/burger-ingredient/ingredient-modal.tsx';
import { Layout } from '@components/layout/layout';
import { FeedModal } from '@pages/feed/feed-modal.tsx';
import { FeedPage } from '@pages/feed/feed.tsx';
import { OrderItem } from '@pages/feed/order-item.tsx';
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
  FeedPage,
  FeedModal,
  OrderItem,
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
