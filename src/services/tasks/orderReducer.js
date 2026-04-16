import { ADD_ITEM, SORT_ITEMS, REMOVE_ITEM, SUBMIT_ORDER } from './actions.js';

const initialState = {
  orderBuns: [],
  orderIngredients: [],
  submittedOrder: {},
};

export const orderReducer = (state = initialState, action) => {
  let tempArray, tempItem;
  switch (action.type) {
    case ADD_ITEM:
      if (action.payload.type === 'bun') {
        return { ...state, orderBuns: [action.payload, action.payload] };
      } else {
        return {
          ...state,
          orderIngredients: [...state.orderIngredients, action.payload],
        };
      }
    case REMOVE_ITEM:
      return {
        ...state,
        orderIngredients: [
          ...state.orderIngredients.slice(0, action.payload),
          ...state.orderIngredients.slice(action.payload + 1),
        ],
      };
    case SORT_ITEMS:
      if (action.payload.oldIndex === action.payload.newIndex) {
        return state;
      }
      tempArray = [...state.orderIngredients];
      tempItem = tempArray[action.payload.oldIndex];
      tempArray.splice(action.payload.oldIndex, 1);
      tempArray.splice(action.payload.newIndex, 0, tempItem);
      return {
        ...state,
        orderIngredients: tempArray,
      };
    case SUBMIT_ORDER:
      return {
        ...state,
        submittedOrder: action.payload,
        orderIngredients: [],
        orderBuns: [],
      };
    default:
      return state;
  }
};
