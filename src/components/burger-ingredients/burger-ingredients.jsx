import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, Fragment } from 'react';

import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  const [activeTab, setTab] = useState(0);
  console.log(styles);
  const handleTab = function (newTab) {
    console.log(newTab);
    setTab(newTab);
  };
  const types = [
    { type: 'bun', name: 'Булки' },
    { type: 'main', name: 'Начинки' },
    { type: 'sauce', name: 'Соусы' },
  ];
  console.log(ingredients);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          {types.map((type, index) => (
            <Fragment key={index}>
              <Tab
                value={type.type}
                active={activeTab === index}
                onClick={() => {
                  handleTab(index);
                  /* TODO */
                }}
              >
                {type.name}
              </Tab>
            </Fragment>
          ))}
        </ul>
      </nav>
      <div className={styles.burger_ingredients_content}>
        {types.map((type, index) => (
          <Fragment key={index}>
            <h2 className="text text_type_main-medium mt-10 mb-6">{type.name}</h2>
            {/*<div className={styles.burger_ingredients__items}>*/}
            {ingredients
              .filter((ingredients) => ingredients.type === type.type)
              .map((ingredient) => (
                <BurgerIngredient {...ingredient} key={ingredient._id} />
              ))}
            {/*</div>*/}
          </Fragment>
        ))}
      </div>
    </section>
  );
};
