import { Preloader } from '@krgaa/react-developer-burger-ui-components';
// import { ingredients } from '@utils/ingredients';
import { useState, useEffect, useRef, useCallback, useReducer } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import fetchHelper from '../../utils/fetch';

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
    setOrder((order) => [...order, ingredient]);
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
    fetchHelper({
      url: import.meta.env.VITE_API_KEY + 'api/ingredients',
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
