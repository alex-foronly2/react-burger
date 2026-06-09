import { Preloader } from '@krgaa/react-developer-burger-ui-components';
// import {CurrencyIcon, Counter, Preloader} from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';
import { useGetIngredientsQuery } from '@services/api/ingredientsApi';

const BurgerIngredientBody = () => {
  let { showPopup } = useOutletContext();
  const { ingredientId } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, data: ingredients } = useGetIngredientsQuery();
  if (isLoading) {
    return <Preloader />;
  }
  if (error) {
    return error.error;
  }
  const ingredient = ingredients.find((ingredient) => ingredient._id === ingredientId);

  //if no history redirect
  const closeModal = (e) => {
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
