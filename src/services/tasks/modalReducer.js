import { SHOW_POPUP, HIDE_POPUP } from './actions.js';

const initialState = {
  info: false,
  order: false,
};

export const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_POPUP:
      return Object.assign({}, state, {
        [action.payload.type]: action.payload.id || true,
      });
    case HIDE_POPUP:
      return initialState;
    default:
      return state;
  }
};
