import { SHOW_POPUP, HIDE_POPUP } from './actions.js';

import type { PayloadAction } from '@reduxjs/toolkit';

type modalState = {
  info: boolean | number;
  order: boolean;
};

const initialState: modalState = {
  info: false,
  order: false,
};

type modalPayloadActionType = PayloadAction<{ type: string; id: number }> | null;

export const modalReducer = (
  state = initialState,
  action: modalPayloadActionType
): modalState => {
  switch (action?.type) {
    case SHOW_POPUP:
      return Object.assign({}, state, {
        [action?.payload.type]: action?.payload.id || true,
      });
    case HIDE_POPUP:
      return initialState;
    default:
      return state;
  }
};
