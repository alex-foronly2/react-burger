// import { ingredients } from '@utils/ingredients';
import { useState, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './app.module.css';

export const App = () => {
  console.log('App'); //todo почему сходу 2 раза рендерит
  const [ingredients, setIngredients] = useState([]);
  console.log('ingredients');
  console.log(ingredients);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    console.log(import.meta.env);
    fetch(import.meta.env.VITE_API_KEY + 'api/ingredients', {
      signal,
    })
      .then((response) => response.json())
      .then((response) => {
        //console.log(response.data);
        setIngredients(response.data);
      })
      .catch((e) => console.error(e));

    return () => {
      console.log('cancel');
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
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor ingredients={ingredients} />
      </main>
    </div>
  );
};
