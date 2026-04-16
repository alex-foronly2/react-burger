import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import styles from './order-details.module.css';

export const OrderDetails = () => {
  const submittedOrder = useSelector((store) => store.order.submittedOrder);
  const isLoading = !Object.prototype.hasOwnProperty.call(submittedOrder, 'order');

  return isLoading ? (
    <Preloader />
  ) : (
    <div className={styles.burger_constructor_popup}>
      <div className="text text_type_digits-medium mt-10">
        {submittedOrder.order.number}
      </div>
      <div className="mt-8 text text_type_main-medium">идентификатор заказа</div>
      <div className="mt-15 mb-15">
        <img src="/done.svg" />
      </div>
      <div className="text text_type_main-default">Ваш заказ начали готовить</div>
      <div className="text text_type_main-default text_color_inactive mb-20 mt-2">
        Дождитесь готовности на орбитальной станции
      </div>
    </div>
  );
};
