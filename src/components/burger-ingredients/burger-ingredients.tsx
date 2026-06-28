import { Preloader, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, Fragment, useRef, memo } from 'react';
import { Outlet } from 'react-router-dom';

import { useAppSelector } from '@/hooks/hooks';
import { BurgerIngredient } from '@components/burger-ingredient/burger-ingredient';
import {
  useGetIngredientsQuery,
  type ingredientType,
} from '@services/api/ingredientsApi';

import type { RefObject, JSX } from 'react';

import styles from './burger-ingredients.module.css';

const BurgerIngredientsBody = (): JSX.Element => {
  type Tab = 'bun' | 'main' | 'sauce';
  const [activeTab, setTab] = useState<Tab>('bun');
  const { isLoading, error, data: ingredients } = useGetIngredientsQuery();

  const handleTab = function (newTab: Tab): void {
    setTab(newTab);
    refs[newTab]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = function (): void {
    let closestTab = activeTab;
    let shortestDistance = Math.abs(
      (refs[closestTab]?.current?.getBoundingClientRect().top ?? 0) -
        (navRef?.current?.getBoundingClientRect().top ?? 0)
    );
    for (const type of types) {
      if (type.type !== activeTab) {
        const currentDistance = Math.abs(
          (refs[type.type]?.current?.getBoundingClientRect().top ?? 0) -
            (navRef?.current?.getBoundingClientRect().top ?? 0)
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

  const types: { type: Tab; name: string }[] = [
    { type: 'bun', name: 'Булки' },
    { type: 'main', name: 'Начинки' },
    { type: 'sauce', name: 'Соусы' },
  ];
  const refs: Record<Tab, RefObject<HTMLDivElement | null>> = {
    bun: useRef(null),
    main: useRef(null),
    sauce: useRef(null),
  };
  // refs['bun'] = useRef(null);
  // refs['main'] = useRef(null);
  // refs['sauce'] = useRef(null);
  const navRef: RefObject<HTMLDivElement | null> = useRef(null);

  const currentOrder = useAppSelector((store) => [
    ...store.order.orderBuns,
    ...store.order.orderIngredients,
  ]);
  const count: Record<string, number> = {};
  currentOrder.forEach(function (item: ingredientType) {
    count[item._id] = (count[item._id] || 0) + 1;
  });

  if (error && 'error' in error) {
    return <>error.error</>;
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
            {ingredients &&
              ingredients
                .filter((ingredients) => ingredients.type === type.type)
                .map((ingredient) => (
                  // <Link
                  //   key={ingredient._id}
                  //   to={{ pathname: `/ingredients/${ingredient._id}` }}
                  //   state={{ fromClick: true }}
                  // >
                  <BurgerIngredient
                    ingredient={ingredient}
                    key={ingredient._id}
                    count={count[ingredient._id] || 0}
                  />
                  //</Link>
                ))}
          </Fragment>
        ))}
      </div>
      <Outlet context={{ showPopup: true }} />
    </section>
  );
};

export const BurgerIngredients = memo(BurgerIngredientsBody);
