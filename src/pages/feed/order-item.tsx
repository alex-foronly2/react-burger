import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';

import type { JSX } from 'react';

import type { ingredientType } from '@/services/api/ingredientsApi';
import type { Order } from '@services/user/socket-slice';

import styles from './order-item.module.css';

export type OrderInterface = Omit<Order, 'ingredients'> & {
  ingredients: ingredientType[];
  total: number;
  maxIconsAmount: number;
  hiddenIconsAmount: number;
};

export const OrderItem = (props: OrderInterface): JSX.Element => {
  return (
    <>
      <div className={styles.order}>
        <div
          className={`${styles.corner} ${styles.corner_tl} text text_type_main-default`}
        >
          #{props.number}
        </div>
        <div
          className={`${styles.corner} ${styles.corner_tr} text text_type_main-default text_color_inactive`}
        >
          <FormattedDate date={new Date(props.createdAt)} />
        </div>

        <div className={`${styles.center_block} text text_type_main-default`}>
          {props.name}
        </div>
        <div className={`${styles.icons_wrapper} ${styles.corner} ${styles.corner_bl}`}>
          {props.ingredients.map(
            (ingredient, index) =>
              index < props.maxIconsAmount && (
                <div className={styles.icon_wrapper} key={index}>
                  <img
                    className={styles.icon}
                    alt={ingredient.name}
                    src={ingredient.image_mobile}
                  />
                </div>
              )
          )}
          {props.hiddenIconsAmount > 0 && (
            <span className={`${styles.icon_text} text text_type_main-small`}>
              +{props.hiddenIconsAmount}
            </span>
          )}
        </div>
        <div
          className={`${styles.corner} ${styles.corner_br} text text_type_digits-medium`}
        >
          {props.total}
          <CurrencyIcon type="primary" className="ml-2" />
        </div>
      </div>
    </>
  );
};
