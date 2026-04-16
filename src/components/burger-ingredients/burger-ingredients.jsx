import { Preloader, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, Fragment, useRef, memo } from 'react';
import { useSelector } from 'react-redux';

import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';
import { useGetIngredientsQuery } from '@services/api/ingredientsApi';

import styles from './burger-ingredients.module.css';

const BurgerIngredientsBody = () => {
  const [activeTab, setTab] = useState('bun');
  const { isLoading, error, data: ingredients } = useGetIngredientsQuery();

  const handleTab = function (newTab) {
    setTab(newTab);
    refs[newTab].current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = function () {
    let closestTab = activeTab;
    let shortestDistance = Math.abs(
      refs[closestTab].current.getBoundingClientRect().top -
        navRef.current.getBoundingClientRect().top
    );
    for (let type of types) {
      if (type.type !== activeTab) {
        let currentDistance = Math.abs(
          refs[type.type].current.getBoundingClientRect().top -
            navRef.current.getBoundingClientRect().top
        );
        if (currentDistance < shortestDistance) {
          shortestDistance = currentDistance;
          closestTab = type.type;
        }
      }
    }
    if (closestTab !== activeTab) {
      setTab(closestTab);
    }
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
  const navRef = useRef(null);

  const currentOrder = useSelector((store) => [
    ...store.order.orderBuns,
    ...store.order.orderIngredients,
  ]);
  const count = {};
  currentOrder.forEach(function (item) {
    count[item._id] = (count[item._id] || 0) + 1;
  });

  if (error) {
    return error.error;
  }
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <section className={styles.burger_ingredients}>
      <nav ref={navRef}>
        <ul className={styles.menu}>
          {types.map((type) => (
            <Fragment key={'nav_' + type.type}>
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
      <div
        className={`${styles.burger_ingredients_content} custom-scroll mb-10`}
        onScroll={handleScroll}
      >
        {types.map((type) => (
          <Fragment key={'header_' + type.type}>
            <h2 className="text text_type_main-medium mt-10 mb-6" ref={refs[type.type]}>
              {type.name}
            </h2>
            {ingredients
              .filter((ingredients) => ingredients.type === type.type)
              .map((ingredient) => (
                <BurgerIngredient
                  igredient={ingredient}
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
