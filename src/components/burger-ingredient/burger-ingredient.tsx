import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useDrag } from 'react-dnd';

import type { JSX } from 'react';

import type { ingredientType } from '@/services/api/ingredientsApi';

import styles from './burger-ingredient.module.css';

type BurgerIngredientInterface = {
  ingredient: ingredientType;
  count: number;
};

const BurgerIngredientBody = (props: BurgerIngredientInterface): JSX.Element => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: props.ingredient,
  });

  return (
    <>
      <div
        className={styles.burger_ingredient}
        ref={(node) => {
          dragRef(node);
        }}
      >
        {props.count > 0 && <Counter count={props.count} size="default" />}
        <img
          className="pl-4 pr-4"
          alt={props.ingredient.name}
          src={props.ingredient.image}
        />
        <span className={`${styles.burger_ingredient_price} mt-1`}>
          {props.ingredient.price}
          <CurrencyIcon type="primary" />
        </span>
        <span className={`${styles.burger_ingredient_text} mt-1`}>
          {props.ingredient.name}
        </span>
      </div>
    </>
  );
};

export const BurgerIngredient = memo(BurgerIngredientBody);
