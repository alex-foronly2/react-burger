import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useDrag } from 'react-dnd';

import styles from './burger-ingredient.module.css';

const BurgerIngredientBody = (props) => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: props.igredient,
  });

  return (
    <>
      <div className={styles.burger_ingredient} ref={dragRef}>
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
    </>
  );
};

export const BurgerIngredient = memo(BurgerIngredientBody);
