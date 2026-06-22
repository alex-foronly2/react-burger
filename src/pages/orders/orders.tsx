import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { OrderItem } from '@/pages';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import {
  useGetIngredientsQuery,
  type ingredientType,
} from '@services/api/ingredientsApi';
import { connect, disconnect, selectOrders } from '@services/user/socket-slice';

import type { JSX } from 'react';

import type { OrderInterface } from '../feed/order-item';

import styles from './orders.module.css';

export const Orders = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isLoading, data: ingredients } = useGetIngredientsQuery();

  useEffect(() => {
    dispatch(
      connect({
        endpoint:
          'orders?token=' + localStorage.getItem('accessToken')?.replace('Bearer ', ''),
        socketType: 'orders',
      })
    );

    return (): void => {
      dispatch(disconnect('orders'));
    };
  }, []);

  const orders = useAppSelector(selectOrders);
  if (isLoading || !ingredients) {
    return <Preloader />;
  }

  const maxIconsAmount = 4;
  let ordersCopy: OrderInterface[] = orders.map((order) => {
    const resolvedIngredients = order.ingredients
      .map((ingredientId) => ingredients.find((item) => item._id === ingredientId))
      .filter((item): item is ingredientType => item !== undefined);

    const total = resolvedIngredients.reduce((acc, curr) => acc + curr.price, 0);

    const hiddenIconsAmount = Math.max(0, resolvedIngredients.length - maxIconsAmount);

    return {
      ...order,
      ingredients: resolvedIngredients,
      total,
      hiddenIconsAmount,
      maxIconsAmount,
    };
  });
  ordersCopy = ordersCopy.map((order) => ({
    ...order,
    total: order.ingredients.reduce(
      (accumulator, currentValue) => accumulator + currentValue.price,
      0
    ),
    hiddenIconsAmount: Math.max(0, order.ingredients.length - maxIconsAmount),
  }));

  return (
    <>
      <div className={`${styles.player_orders} custom-scroll`}>
        {ordersCopy.map((order) => (
          <Link
            key={order._id}
            to={{ pathname: `/profile/orders/${order._id}` }}
            state={{ from: '/profile/orders' }}
          >
            <OrderItem {...order} maxIconsAmount={maxIconsAmount} />
          </Link>
        ))}
      </div>
      <Outlet />
    </>
  );
};
