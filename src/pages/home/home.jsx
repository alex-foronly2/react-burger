import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLocation, useParams, Outlet } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './home.module.css';

export const Home = () => {
  const { ingredientId } = useParams();
  console.log(ingredientId);
  const isPageReloaded =
    window.performance &&
    performance.navigation.type == performance.navigation.TYPE_RELOAD;
  const location = useLocation();
  // Если state.fromClick есть — значит пришли по клику
  const isClicked = location.state?.fromClick;
  window.history.replaceState({}, ''); //очищаем location.state
  const showPopup = isClicked || isPageReloaded;
  return (
    <>
      {!ingredientId || showPopup ? (
        <>
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          <main className={`${styles.main} pl-5 pr-5`}>
            <DndProvider backend={HTML5Backend}>
              <BurgerIngredients />
              <BurgerConstructor />
            </DndProvider>
          </main>
        </>
      ) : (
        <Outlet context={{ showPopup }} />
      )}
    </>
  );
};
