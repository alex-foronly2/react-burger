import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, Fragment, useRef, memo } from 'react';

import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';

import styles from './burger-ingredients.module.css';

const BurgerIngredientsBody = ({ ingredients, count, handleAdd }) => {
  const [activeTab, setTab] = useState('bun');
  const handleTab = function (newTab) {
    setTab(newTab);
    refs[newTab].current?.scrollIntoView({ behavior: 'smooth' });
  };

  const types = [
    { type: 'bun', name: 'Булки' },
    { type: 'main', name: 'Начинки' },
    { type: 'sauce', name: 'Соусы' },
  ];
  const refs = {};
  refs['bun'] = useRef(null);
  refs['main'] = useRef(null);
  refs['sauce'] = useRef(null);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          {types.map((type) => (
            <Fragment key={type.type}>
              <Tab
                value={type.type}
                active={activeTab === type.type}
                onClick={() => {
                  handleTab(type.type);
                }}
              >
                {type.name}
              </Tab>
            </Fragment>
          ))}
        </ul>
      </nav>
      <div className={`${styles.burger_ingredients_content} custom-scroll mb-10`}>
        {types.map((type) => (
          <Fragment key={type.type}>
            <h2 className="text text_type_main-medium mt-10 mb-6" ref={refs[type.type]}>
              {type.name}
            </h2>
            {ingredients
              .filter((ingredients) => ingredients.type === type.type)
              .map((ingredient) => (
                <BurgerIngredient
                  {...ingredient}
                  onAdd={handleAdd}
                  key={ingredient._id}
                  count={count[ingredient._id] || 0}
                />
              ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export const BurgerIngredients = memo(BurgerIngredientsBody);
