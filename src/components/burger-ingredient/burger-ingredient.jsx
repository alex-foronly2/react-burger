import {
  CurrencyIcon,
  Counter,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '@components/modal/modal';
import { useGetIngredientsQuery } from '@services/api/ingredientsApi';
import { ADD_ITEM, HIDE_POPUP, SHOW_POPUP } from '@services/tasks/actions';

import styles from './burger-ingredient.module.css';

const BurgerIngredientBody = (props) => {
  const { data: ingredients } = useGetIngredientsQuery();
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

  const handleAddButtonClick = () => {
    const chosenIngredient = ingredients.find(
      (item) => item._id === props.igredient._id
    );
    dispatch({
      type: ADD_ITEM,
      payload: chosenIngredient,
    });
    dispatch({
      type: HIDE_POPUP,
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
          <div className={styles.burger_ingredient_info}>
            <img
              className="pl-4 pr-4"
              alt={props.igredient.name}
              src={props.igredient.image}
            />
          </div>
          <div
            className={`${styles.burger_ingredient_info} text text_type_main-default mt-4`}
          >
            {props.igredient.name}
          </div>
          <div
            className={`${styles.burger_ingredient_info} ${styles.burger_ingredient_wide} text text_type_main-default text_color_inactive mt-8`}
          >
            <div className={styles.burger_ingredient_item}>
              <span className="text_type_main-small">Каллории,ккал</span>
              <span className="text_type_digits-default">
                {props.igredient.calories}
              </span>
            </div>
            <div className={styles.burger_ingredient_item}>
              <span className="text_type_main-small">Белки, г</span>
              <span className="text_type_digits-default">
                {props.igredient.proteins}
              </span>
            </div>
            <div className={styles.burger_ingredient_item}>
              <span className="text_type_main-small">Жиры, г</span>
              <span className="text_type_digits-default">{props.igredient.fat}</span>
            </div>
            <div className={styles.burger_ingredient_item}>
              <span className="text_type_main-small">Углеводы, г</span>
              <span className="text_type_digits-default">
                {props.igredient.carbohydrates}
              </span>
            </div>
          </div>
          <div className={styles.burger_ingredient_info}>
            <Button
              onClick={handleAddButtonClick}
              size="small"
              type="primary"
              extraClass="mt-8 mb-15"
            >
              Добавить
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export const BurgerIngredient = memo(BurgerIngredientBody);
