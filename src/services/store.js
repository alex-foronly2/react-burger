import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';

import { authApi } from '@services/api/authApi';

import { ingredientsApi } from './api/ingredientsApi';
import { orderApi } from './api/orderApi';
import { modalReducer } from './tasks/modalReducer';
import { orderReducer } from './tasks/orderReducer';
import { authSlice } from './user/slice.js';

export const rootReducer = combineSlices(ingredientsApi, orderApi, authApi, authSlice, {
  order: orderReducer,
  modal: modalReducer,
});

export const configureStore = () => {
  return createStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware()
        .concat(ingredientsApi.middleware)
        .concat(orderApi.middleware)
        .concat(authApi.middleware);
    },
  });
};
