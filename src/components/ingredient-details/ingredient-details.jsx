import { Button } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { useGetIngredientsQuery } from '@services/api/ingredientsApi';
import { ADD_ITEM, HIDE_POPUP } from '@services/tasks/actions';

import styles from './ingredient-details.module.css';

const IngredientDetailsBody = (props) => {
  const { data: ingredients } = useGetIngredientsQuery();
  const dispatch = useDispatch();

  const handleAddButtonClick = () => {
    const chosenIngredient = ingredients.find((item) => item._id === props._id);
    dispatch({
      type: ADD_ITEM,
      payload: {
        ...chosenIngredient,
        uniqueId: uuidv4(),
      },
    });
    dispatch({
      type: HIDE_POPUP,
    });
  };

  return (
    <>
      <div className={styles.burger_ingredient_info}>
        <img className="pl-4 pr-4" alt={props.name} src={props.image} />
      </div>
      <div
        className={`${styles.burger_ingredient_info} text text_type_main-default mt-4`}
      >
        {props.name}
      </div>
      <div
        className={`${styles.burger_ingredient_info} ${styles.burger_ingredient_wide} text text_type_main-default text_color_inactive mt-8`}
      >
        <div className={styles.burger_ingredient_item}>
          <span className="text_type_main-small">Каллории,ккал</span>
          <span className="text_type_digits-default">{props.calories}</span>
        </div>
        <div className={styles.burger_ingredient_item}>
          <span className="text_type_main-small">Белки, г</span>
          <span className="text_type_digits-default">{props.proteins}</span>
        </div>
        <div className={styles.burger_ingredient_item}>
          <span className="text_type_main-small">Жиры, г</span>
          <span className="text_type_digits-default">{props.fat}</span>
        </div>
        <div className={styles.burger_ingredient_item}>
          <span className="text_type_main-small">Углеводы, г</span>
          <span className="text_type_digits-default">{props.carbohydrates}</span>
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
    </>
  );
};

export const IngredientDetails = memo(IngredientDetailsBody);
