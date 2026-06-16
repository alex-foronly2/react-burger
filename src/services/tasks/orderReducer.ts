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
    case ADD_ITEM: {
      const addedItemPayload = (action as PayloadAction<Bun | Filling>).payload;
      if (addedItemPayload.type === 'bun') {
        return { ...state, orderBuns: [addedItemPayload, addedItemPayload] };
      } else {
        return {
          ...state,
          orderIngredients: [...state.orderIngredients, addedItemPayload],
        };
      }
    }
    case REMOVE_ITEM: {
      const removedItemPayload = (action as PayloadAction<string>).payload;
      return {
        ...state,
        orderIngredients: state.orderIngredients.filter(
          (item) => item.uniqueId !== removedItemPayload
        ),
      };
    }
    case SORT_ITEMS: {
      const sortedItemPayload = (
        action as PayloadAction<{ uniqueId: string; newIndex: number }>
      ).payload;
      oldIndex = state.orderIngredients.findIndex(
        (item) => item.uniqueId === sortedItemPayload.uniqueId
      );
      if (oldIndex === -1 || oldIndex === sortedItemPayload.newIndex) {
        return state;
      }
      tempArray = [...state.orderIngredients];
      tempItem = tempArray[oldIndex];
      tempArray.splice(oldIndex, 1);
      tempArray.splice(sortedItemPayload.newIndex, 0, tempItem);
      return {
        ...state,
        orderIngredients: tempArray,
      };
    }
    case SUBMIT_ORDER:
      return {
        ...state,
        submittedOrder: {},
        isSending: true,
      };
    case COMPLETE_ORDER: {
      const completedOrderPayload = (action as PayloadAction<Order>).payload;
      return {
        ...state,
        isSending: false,
        submittedOrder: completedOrderPayload,
        orderIngredients: [],
        orderBuns: [],
      };
    }
    default:
      return state;
  }
};
