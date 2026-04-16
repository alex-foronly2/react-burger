import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';
import { HIDE_POPUP, SHOW_POPUP } from '@services/tasks/actions';

import styles from './burger-ingredient.module.css';

const BurgerIngredientBody = (props) => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: props.igredient,
  });
  const showModal = useSelector((store) => store.modal.info === props.igredient._id);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: HIDE_POPUP,
    });
  };
  const handleClick = () => {
    dispatch({
      type: SHOW_POPUP,
      payload: {
        type: 'info',
        id: props.igredient._id,
      },
    });
  };

  return (
    <>
      <div className={styles.burger_ingredient} onClick={handleClick} ref={dragRef}>
        {props.count > 0 && <Counter count={props.count} size="default" />}
        <img
          className="pl-4 pr-4"
          alt={props.igredient.name}
          src={props.igredient.image}
        />
        <span className={`${styles.burger_ingredient_price} mt-1`}>
          {props.igredient.price}
          <CurrencyIcon type="primary" />
        </span>
        <span className={`${styles.burger_ingredient_text} mt-1`}>
          {props.igredient.name}
        </span>
      </div>
      {showModal && (
        <Modal onClose={closeModal} header="Детали ингредиента">
          <IngredientDetails {...props.igredient} />
        </Modal>
      )}
    </>
  );
};

export const BurgerIngredient = memo(BurgerIngredientBody);
