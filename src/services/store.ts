// import { combineSlices, configureStore as createStore } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authApi } from '@services/api/authApi';
import { orderReducer } from '@services/tasks/orderReducer';

import { ingredientsApi } from './api/ingredientsApi';
import { orderApi } from './api/orderApi';
import { modalReducer } from './tasks/modalReducer';
import { authSlice } from './user/slice.js';

export const rootReducer = combineSlices(ingredientsApi, orderApi, authApi, authSlice, {
  order: orderReducer,
  modal: modalReducer,
});

// export const configureStore = () => {
// export const configureStore = () => {
//   return createStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) => {
//       return getDefaultMiddleware()
//         .concat(ingredientsApi.middleware)
//         .concat(orderApi.middleware)
//         .concat(authApi.middleware);
//     },
//   });
// };
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ingredientsApi.middleware)
      .concat(orderApi.middleware)
      .concat(authApi.middleware),
});

// export const store = configureStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
