import { SHOW_POPUP, HIDE_POPUP } from './actions.js';

import type { PayloadAction, UnknownAction } from '@reduxjs/toolkit';

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
  action: modalPayloadActionType | UnknownAction
): modalState => {
  switch (action?.type) {
    case SHOW_POPUP: {
      const showPopupAction = action as PayloadAction<{ type: string; id: number }>;
      return Object.assign({}, state, {
        [showPopupAction.payload.type]: showPopupAction.payload.id || true,
      });
    }
    case HIDE_POPUP:
      return initialState;
    default:
      return state;
  }
};
