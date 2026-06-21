import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { OrderItem } from '@/pages';
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import {
  useGetIngredientsQuery,
  type ingredientType,
} from '@services/api/ingredientsApi';
import {
  connect,
  disconnect,
  selectOrders,
  selectTotal,
  selectTotalToday,
} from '@services/user/socket-slice';

import type { JSX } from 'react';

import type { OrderInterface } from './order-item';

import styles from './feed.module.css';

export const FeedPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isLoading, data: ingredients } = useGetIngredientsQuery();

  useEffect((): (() => void) => {
    dispatch(connect({ endpoint: 'orders/all' }));

    return (): void => {
      dispatch(disconnect());
    };
  }, []);
  const orders = useAppSelector(selectOrders);
  const total = useAppSelector(selectTotal);
  const totalToday = useAppSelector(selectTotalToday);

  if (isLoading || !ingredients) {
    return <Preloader />;
  }

  const maxIconsAmount = 4;
  const ordersCopy: OrderInterface[] = orders.map((order) => {
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

  const doneOrders = orders.filter((order) => order.status === 'done').slice(0, 20);
  const cookingOrders = orders.filter((order) => order.status !== 'done').slice(0, 20);
  const doneOrdersLeft = doneOrders.slice(0, 10);
  const doneOrdersRight = doneOrders.slice(10, 20);
  const cookingOrdersLeft = cookingOrders.slice(0, 10);
  const cookingOrdersRight = cookingOrders.slice(10, 20);
  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 ml-5 mb-5 pl-5`}>
        Лента заказов
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <div className={`${styles.orders} custom-scroll`}>
          {ordersCopy.map((order) => (
            <Link key={order._id} to={{ pathname: `/feed/${order._id}` }}>
              <OrderItem {...order} maxIconsAmount={maxIconsAmount} />
            </Link>
          ))}
        </div>
        <div className={`${styles.info} ml-10`}>
          <div className={styles.info_last_orders}>
            <div className={styles.info_half}>
              <div className={'mb-4 text text_type_main-medium'}>Готовы:</div>
              <div
                className={`${styles.ready} ${doneOrdersRight.length && styles.two_column}`}
              >
                <div className={styles.left}>
                  {doneOrdersLeft.map((order) => (
                    <div className="text text_type_digits-default" key={order._id}>
                      {order.number}
                    </div>
                  ))}
                </div>
                <div className={styles.left}>
                  {doneOrdersRight.map((order) => (
                    <div className="text text_type_digits-default" key={order._id}>
                      {order.number}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.info_half}>
              <div className={'mb-4 text text_type_main-medium'}>В работе:</div>
              <div className={`${cookingOrdersRight.length && styles.two_column}`}>
                <div className={styles.left}>
                  {cookingOrdersLeft.map((order) => (
                    <div className="text text_type_digits-default" key={order._id}>
                      {order.number}
                    </div>
                  ))}
                </div>
                <div className={styles.left}>
                  {cookingOrdersRight.map((order) => (
                    <div className="text text_type_digits-default" key={order._id}>
                      {order.number}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={'mt-10'}>
            <div className={'text text_type_main-medium'}>
              Выполнено за всё время:
              <div className="text text_type_digits-large">{total}</div>
            </div>
            <div className={'text text_type_main-medium'}>
              Выполнено за сегодня:
              <div className="text text_type_digits-large">{totalToday}</div>
            </div>
          </div>
        </div>
      </main>
      <Outlet />
    </>
  );
};
