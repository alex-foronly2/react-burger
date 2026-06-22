import { Button } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '@/hooks/hooks';
import { useGetIngredientsQuery } from '@services/api/ingredientsApi';
import { ADD_ITEM } from '@services/tasks/actions';

import type { JSX } from 'react';

import type { ingredientType } from '@services/api/ingredientsApi';

// import type { Bun, Filling } from '@services/tasks/orderReducer';
import styles from './ingredient-details.module.css';

const IngredientDetailsBody = (
  props: ingredientType & { hideButton?: boolean }
): JSX.Element => {
  const { data: ingredients } = useGetIngredientsQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAddButtonClick = (): void => {
    if (!ingredients) {
      return;
    }
    const chosenIngredient = ingredients.find(
      (item: ingredientType) => item._id === props._id
    );
    dispatch({
      type: ADD_ITEM,
      payload: {
        ...chosenIngredient,
        uniqueId: uuidv4(),
      },
    });
    navigate('/');
  };

  return (
    <>
      <div className={styles.burger_ingredient_parent}>
        <div className={styles.burger_ingredient_info}>
          <img className="pl-4 pr-4" alt={props.name} src={props.image_large} />
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
        {!props.hideButton && (
          <div className={styles.burger_ingredient_info}>
            <Button
              onClick={handleAddButtonClick}
              size="small"
              type="primary"
              htmlType="button"
              extraClass="mt-8 mb-15"
            >
              Добавить
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export const IngredientDetails = memo(IngredientDetailsBody);
