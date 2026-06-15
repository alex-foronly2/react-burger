import {
  ADD_ITEM,
  SORT_ITEMS,
  REMOVE_ITEM,
  SUBMIT_ORDER,
  COMPLETE_ORDER,
} from './actions.js';

import type { PayloadAction, Action } from '@reduxjs/toolkit';

type Ingredient = {
  uniqueId: string;
  calories: number;
  carbohydrates: number;
  fat: number;
  image: string;
  image_large: string;
  image_mobile: string;
  name: string;
  price: number;
  proteins: number;
  __v: 0;
  _id: string;
};

export type Bun = {
  type: 'bun';
} & Ingredient;

export type Filling = {
  type: 'sauce' | 'main';
} & Ingredient;

type Order = {
  success?: boolean;
  name?: string;
  order?: { number: number };
};

type OrderInterface = {
  orderBuns: Bun[];
  orderIngredients: Filling[];
  isSending: boolean;
  submittedOrder: Order;
};

const initialState: OrderInterface = {
  orderBuns: [],
  orderIngredients: [],
  isSending: false,
  submittedOrder: {},
};

type PayloadActionType =
  | PayloadAction<Bun>
  | PayloadAction<Filling>
  | PayloadAction<string>
  | PayloadAction<{ uniqueId: string; newIndex: number }>
  | PayloadAction<Order>
  | Action;
export const orderReducer = (
  state = initialState,
  action: PayloadActionType
): OrderInterface => {
  let tempArray, tempItem, oldIndex;
  switch (action.type) {
    case ADD_ITEM:
      if (action?.payload?.type === 'bun') {
        return { ...state, orderBuns: [action?.payload, action?.payload] };
      } else {
        return {
          ...state,
          orderIngredients: [...state.orderIngredients, action?.payload],
        };
      }
    case REMOVE_ITEM:
      return {
        ...state,
        orderIngredients: state.orderIngredients.filter(
          (item) => item.uniqueId !== action?.payload
        ),
      };
    case SORT_ITEMS:
      oldIndex = state.orderIngredients.findIndex(
        (item) => item.uniqueId === action?.payload?.uniqueId
      );
      if (oldIndex === -1 || oldIndex === action?.payload?.newIndex) {
        return state;
      }
      tempArray = [...state.orderIngredients];
      tempItem = tempArray[oldIndex];
      tempArray.splice(oldIndex, 1);
      tempArray.splice(action?.payload?.newIndex, 0, tempItem);
      return {
        ...state,
        orderIngredients: tempArray,
      };
    case SUBMIT_ORDER:
      return {
        ...state,
        submittedOrder: {},
        isSending: true,
      };
    case COMPLETE_ORDER:
      return {
        ...state,
        isSending: false,
        submittedOrder: action?.payload,
        orderIngredients: [],
        orderBuns: [],
      };
    default:
      return state;
  }
};
