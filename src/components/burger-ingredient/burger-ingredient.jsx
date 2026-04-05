import {
  CurrencyIcon,
  Counter,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, memo } from 'react';

import Modal from '@components/modal/modal';

import styles from './burger-ingredient.module.css';

const BurgerIngredientBody = (props) => {
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };
  const handleClick = () => {
    setShowModal(true);
  };

  const handleAddButtonClick = () => {
    props.onAdd(props._id);
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.burger_ingredient} onClick={handleClick}>
        {props.count > 0 && <Counter count={props.count} size="default" />}
        <img className="pl-4 pr-4" alt={props.name} src={props.image} />
        <span className={`${styles.burger_ingredient_price} mt-1`}>
          {props.price}
          <CurrencyIcon type="primary" />
        </span>
        <span className={`${styles.burger_ingredient_text} mt-1`}>{props.name}</span>
      </div>
      {showModal && (
        <Modal onClose={closeModal} header="Детали ингредиента">
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
        </Modal>
      )}
    </>
  );
};

export const BurgerIngredient = memo(BurgerIngredientBody);
