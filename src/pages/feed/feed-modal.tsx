import {
  CurrencyIcon,
  FormattedDate,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Modal from '@components/modal/modal';
import { useAppSelector } from '@hooks/hooks';
import { useGetIngredientsQuery } from '@services/api/ingredientsApi';
import { useGetTheOrderQuery } from '@services/api/orderApi';
import { selectOrders } from '@services/user/socket-slice';

import type { JSX, SyntheticEvent } from 'react';

import type { ingredientType } from '@services/api/ingredientsApi';

import styles from './feed-modal.module.css';

const OrderInfoBody = (): JSX.Element => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const orders = useAppSelector(selectOrders);
  const location = useLocation();
  let orderContent = null;
  if (orders.length) {
    orderContent = orders.find((order) => order._id === orderId);
  }
  const {
    isLoading,
    error,
    data: fetchedOrder,
  } = useGetTheOrderQuery(orderId || '', {
    skip: !!(orderContent || !orders.length || !orderId),
  });
  const { data: ingredients } = useGetIngredientsQuery();

  const orderToRender = orderContent || fetchedOrder;

  if (isLoading || !orders.length || !ingredients) {
    return <Preloader />;
  }
  const closeModal = (e?: SyntheticEvent): void => {
    if (e) {
      e.stopPropagation();
    }
    navigate(location.state?.from || '/feed');
  };
  if (error) {
    return <Modal onClose={closeModal}>{String(error)}</Modal>;
  }

  const status =
    orderToRender.status === 'done'
      ? 'Выполнен'
      : orderToRender.status === 'created'
        ? 'Создан'
        : 'Готовится';
  type OrderIngredientEntry = {
    ingredient: ingredientType;
    amount: number;
  };

  type OrderIngredientsMap = Record<string, OrderIngredientEntry>;
  const orderIngredients: OrderIngredientsMap = {};
  let total = 0;
  orderToRender.ingredients.forEach((ingredientId: string) => {
    if (Object.hasOwn(orderIngredients, ingredientId)) {
      total += orderIngredients[ingredientId]
        ? orderIngredients[ingredientId].ingredient.price
        : 0;
      orderIngredients[ingredientId].amount += 1;

      return;
    }
    const foundIngredient = ingredients.find((item) => item._id === ingredientId);
    if (!foundIngredient) {
      return;
    }
    // orderIngredients[ingredientId] = {};
    orderIngredients[ingredientId] = {
      ingredient: foundIngredient,
      amount: 1,
    };
    total += orderIngredients[ingredientId].ingredient.price;
    // orderIngredients[ingredientId].amount = 1;
  });

  return (
    <>
      <Modal onClose={closeModal} header={`#${orderToRender.number}`}>
        <div className={styles.content}>
          <div className="text text_type_main-medium">{orderToRender.name}</div>

          <div className={styles.status}>{status}</div>
          <div className="text text_type_main-medium mt-10">Состав:</div>
          <div className={`${styles.burger_content} custom-scroll`}>
            {Object.values(orderIngredients).map((item) => (
              <div key={item.ingredient._id} className={styles.ingredient}>
                <div className={styles.icon_name}>
                  <div className={styles.icon_wrapper}>
                    <img
                      className={styles.icon}
                      alt={item.ingredient.name}
                      src={item.ingredient.image_mobile}
                    />
                  </div>
                  <div className={`text text_type_digits-small`}>
                    {item.ingredient.name}
                  </div>
                </div>
                <div className={`${styles.price} text text_type_digits-small`}>
                  {item.amount} x {item.ingredient.price}
                  <CurrencyIcon type="primary" className="ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${styles.corner} ${styles.corner_bl} text text_type_main-default text_color_inactive`}
        >
          <FormattedDate date={new Date(orderToRender.createdAt)} />
        </div>
        <div
          className={`${styles.corner} ${styles.corner_br} text text_type_digits-medium`}
        >
          {total}
          <CurrencyIcon type="primary" className="ml-2" />
        </div>
      </Modal>
    </>
  );
};

export const FeedModal = memo(OrderInfoBody);
