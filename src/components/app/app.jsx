import { Preloader } from '@krgaa/react-developer-burger-ui-components';
// import { ingredients } from '@utils/ingredients';
import { useState, useEffect, useRef, useCallback, useReducer } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import request from '../../utils/request';

import styles from './app.module.css';

export const App = () => {
  const [order, setOrder] = useState([]);
  const ingredientsRef = useRef([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const count = {};
  order.forEach(function (item) {
    count[item._id] = (count[item._id] || 0) + 1;
  });

  const handleAdd = useCallback((id) => {
    const ingredient = ingredientsRef.current.find((item) => item._id === id);
    setOrder((order) => {
      let tempOrder;
      //вставляем в конец или перед последней булкой
      if (ingredient.type === 'bun') {
        tempOrder = order.filter((item) => item.type !== 'bun');
        tempOrder.unshift(Object.assign({ position: 'top' }, ingredient));
        tempOrder.push(Object.assign({ position: 'bottom' }, ingredient));
      } else {
        tempOrder = order.filter(() => 1);
        if (tempOrder.length && tempOrder[tempOrder.length - 1].type === 'bun') {
          tempOrder.splice(-1, 0, ingredient);
        } else {
          tempOrder.push(ingredient);
        }
      }
      return tempOrder;
    });
  }, []);

  const handleRemove = useCallback((index) => {
    setOrder((order) => [...order.slice(0, index), ...order.slice(index + 1)]);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCallback = (data) => {
      ingredientsRef.current = data;
      forceUpdate();
    };
    request({
      endpoint: 'api/ingredients',
      controller,
      callback: fetchCallback,
    });

    return () => {
      // Отменяем запрос
      controller.abort({ reason: 'canceled on component unmount' });
    };
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        {ingredientsRef.current.length ? (
          <>
            <BurgerIngredients
              ingredients={ingredientsRef.current}
              handleAdd={handleAdd}
              count={count}
            />
            <BurgerConstructor
              ingredients={ingredientsRef.current}
              handleRemove={handleRemove}
              order={order}
              setOrder={setOrder}
            />
          </>
        ) : (
          <Preloader />
        )}
      </main>
    </div>
  );
};
