import {
  ADD_ITEM,
  SORT_ITEMS,
  REMOVE_ITEM,
  SUBMIT_ORDER,
  COMPLETE_ORDER,
} from './actions.js';

const initialState = {
  orderBuns: [],
  orderIngredients: [],
  isSending: false,
  submittedOrder: {},
};

export const orderReducer = (state = initialState, action) => {
  let tempArray, tempItem, oldIndex;
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
        orderIngredients: state.orderIngredients.filter(
          (item) => item.uniqueId !== action.payload
        ),
      };
    case SORT_ITEMS:
      oldIndex = state.orderIngredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      if (oldIndex === -1 || oldIndex === action.payload.newIndex) {
        return state;
      }
      tempArray = [...state.orderIngredients];
      tempItem = tempArray[oldIndex];
      tempArray.splice(oldIndex, 1);
      tempArray.splice(action.payload.newIndex, 0, tempItem);
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
        submittedOrder: action.payload,
        orderIngredients: [],
        orderBuns: [],
      };
    default:
      return state;
  }
};
