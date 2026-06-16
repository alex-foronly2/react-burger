import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';
import { useGetIngredientsQuery } from '@services/api/ingredientsApi';

// import {CurrencyIcon, Counter, Preloader} from '@krgaa/react-developer-burger-ui-components';
import type { JSX, SyntheticEvent } from 'react';

import type { ingredientType } from '@services/api/ingredientsApi';
// import type { Bun, Filling } from '@/services/tasks/orderReducer';

const BurgerIngredientBody = (): JSX.Element => {
  type MyOutletContext = {
    showPopup: boolean;
  };
  const { showPopup } = useOutletContext<MyOutletContext>();
  const { ingredientId } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, data: ingredients } = useGetIngredientsQuery();
  if (isLoading) {
    return <Preloader />;
  }
  if (error && 'error' in error) {
    return <>error.error</>;
  }
  if (!ingredients) {
    return <></>;
  }
  const ingredient = ingredients.find(
    (ingredient: ingredientType) => ingredient._id === ingredientId
  );
  if (!ingredient) {
    return <></>;
  }

  //if no history redirect
  const closeModal = (e?: SyntheticEvent): void => {
    if (e) {
      e.stopPropagation();
    }
    navigate('/');
  };

  return (
    <>
      {showPopup ? (
        <Modal onClose={closeModal} header="Детали ингредиента">
          <IngredientDetails {...ingredient} />
        </Modal>
      ) : (
        <IngredientDetails hideButton={true} {...ingredient} />
      )}
    </>
  );
};

export const IngredientModal = memo(BurgerIngredientBody);
