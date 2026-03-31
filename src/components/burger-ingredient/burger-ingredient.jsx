import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import styles from './burger-ingredient.module.css';

export const BurgerIngredient = (props) => {
  return (
    <div className={styles.burger_ingredient}>
      {/*<img className="constructor-element__image pl-4 pr-4" alt={props.name} src={props.image} />*/}
      <Counter count={1} size="default" />
      <img className="pl-4 pr-4" alt={props.name} src={props.image} />
      {/*todo counter*/}
      {/*<span className="constructor-element__price">*/}
      <span className={`${styles.burger_ingredient_price} mt-1`}>
        {props.price}
        <CurrencyIcon type="primary" />
      </span>
      {/*<span className="constructor-element__text">{props.name}</span>*/}
      <span className={`${styles.burger_ingredient_text} mt-1`}>{props.name}</span>
    </div>
  );
};
