import { describe, expect, it } from 'vitest';

import {
  testEmail,
  testName,
  orderBun,
  orderIngredient,
} from '@services/user/slice.moke';

import {
  ADD_ITEM,
  SORT_ITEMS,
  REMOVE_ITEM,
  SUBMIT_ORDER,
  COMPLETE_ORDER,
} from './actions.js';
import { orderReducer } from './orderReducer';

import type { ingredientType } from '@services/user/slice.moke';

// type ingredientType = 'main' | 'sauce';
//
// export const orderBun = {
//   _id: '692889f16bf770001bfeb4cd',
//   name: 'Флюоресцентная булка R2-D3',
//   type: 'bun' as const,
//   proteins: 44,
//   fat: 26,
//   carbohydrates: 85,
//   calories: 643,
//   price: 988,
//   image: 'https://code.s3.yandex.net/react/code/bun-01.png',
//   image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
//   image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
//   __v: 0 as const,
// };
// export const orderIngredient = {
//   _id: '692889f16bf770001bfeb4d0',
//   name: 'Говяжий метеорит (отбивная)',
//   type: 'main' as ingredientType,
//   proteins: 800,
//   fat: 800,
//   carbohydrates: 300,
//   calories: 2674,
//   price: 3000,
//   image: 'https://code.s3.yandex.net/react/code/meat-04.png',
//   image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
//   image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
//   __v: 0 as const,
// };

describe('Order Reducers', () => {
  const bun = {
    uniqueId: 'bun1',
    _id: '60666c42cc7b410027a1a9b1',
    name: 'Краторная булка N-200i',
    type: 'bun' as const,
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0 as const,
  };

  const ingredient = {
    uniqueId: 'main1',
    _id: '60666c42cc7b410027a1a9b5',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main' as ingredientType,
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
    __v: 0 as const,
  };

  const ingredients = [
    {
      uniqueId: 'ingredient1',
      _id: '60666c42cc7b410027a1a9b5',
      name: 'Говяжий метеорит (отбивная)',
      type: 'main' as ingredientType,
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
      __v: 0 as const,
    },
    {
      uniqueId: 'ingredient2',
      _id: '60666c42cc7b410027a1a9b6',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main' as ingredientType,
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0 as const,
    },
  ];

  const order = {
    success: true,
    name: 'Флюоресцентный метеоритный бургер',
    order: {
      ingredients: [orderBun, orderIngredient, orderBun],
      _id: '6a4091c541cff5001b6e6d13',
      owner: {
        name: testName,
        email: testEmail,
        createdAt: '2026-06-06T10:33:43.723Z',
        updatedAt: '2026-06-15T02:37:13.282Z',
      },
      status: 'done',
      name: 'Флюоресцентный метеоритный бургер',
      createdAt: '2026-06-28T03:15:17.181Z',
      updatedAt: '2026-06-28T03:15:17.220Z',
      number: 1923,
      price: 4976,
    },
  };

  it('должен добавлять 2 булки в заказ', () => {
    const result = orderReducer(undefined, {
      type: ADD_ITEM,
      payload: bun,
    });
    expect(result.orderBuns.length).toEqual(2);
    expect(result.orderIngredients.length).toEqual(0);
  });

  it('должен добавлять 1 ингредиент в заказ', () => {
    const result = orderReducer(undefined, {
      type: ADD_ITEM,
      payload: ingredient,
    });
    expect(result.orderBuns.length).toEqual(0);
    expect(result.orderIngredients.length).toEqual(1);
  });

  it('должен сортировать ингредиенты в заказе', () => {
    let result = orderReducer(
      {
        orderBuns: [],
        isSending: false,
        submittedOrder: {},
        orderIngredients: ingredients,
      },
      {
        type: SORT_ITEMS,
        payload: {
          uniqueId: 'ingredient2',
          newIndex: 0,
        },
      }
    );
    expect(result.orderIngredients[0].uniqueId).toEqual('ingredient2');
    result = orderReducer(
      {
        orderBuns: [],
        isSending: false,
        submittedOrder: {},
        orderIngredients: ingredients,
      },
      {
        type: SORT_ITEMS,
        payload: {
          uniqueId: 'ingredient2',
          newIndex: 1,
        },
      }
    );
    expect(result.orderIngredients[0].uniqueId).toEqual('ingredient1');
  });

  it('должен удалять ингредиенты из заказа', () => {
    const result = orderReducer(
      {
        orderBuns: [],
        isSending: false,
        submittedOrder: {},
        orderIngredients: ingredients,
      },
      {
        type: REMOVE_ITEM,
        payload: 'ingredient2',
      }
    );
    expect(result.orderIngredients.length).toEqual(1);
  });

  it('должен отправлять заказ', () => {
    const result = orderReducer(
      {
        orderBuns: [bun, bun],
        isSending: false,
        submittedOrder: {},
        orderIngredients: ingredients,
      },
      {
        type: SUBMIT_ORDER,
      }
    );
    expect(result.isSending).toBeTruthy();
  });

  it('должен сбрасывать заказ', () => {
    const result = orderReducer(
      {
        orderBuns: [bun, bun],
        isSending: true,
        submittedOrder: {},
        orderIngredients: ingredients,
      },
      {
        type: COMPLETE_ORDER,
        payload: order,
      }
    );
    expect(result.isSending).toBeFalsy();
    expect(result.submittedOrder.success).toBeTruthy();
    expect(result.submittedOrder.name).toEqual('Флюоресцентный метеоритный бургер');
  });
});
