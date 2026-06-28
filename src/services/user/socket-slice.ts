import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ConnectPayload, SocketType } from './socket-middleware';

// Интерфейсы для данных

export type Status = 'done' | 'pending' | 'created';

export type Order = {
  createdAt: string;
  ingredients: string[];
  name: string;
  number: number;
  status: Status;
  updatedAt: string;
  _id: string;
};

type SocketState = {
  isConnected: boolean;
  orders: Order[];
  total: number;
  totalToday: number;
  error: string | null;
  isLoading: boolean;
};

type SocketStateStore = Record<string, SocketState>;

// Начальное состояние
// const initialState: SocketState = {
//   isConnected: false,
//   orders: [],
//   total: 0,
//   totalToday: 0,
//   error: null,
//   isLoading: false,
// };
const initialState: SocketStateStore = {
  orders: {
    isConnected: false,
    orders: [],
    total: 0,
    totalToday: 0,
    error: null,
    isLoading: false,
  },
};

type ErrorPayload = {
  message: string;
  socketType: SocketType;
};

// Создаём слайс
const socketSlice = createSlice({
  name: 'socket', // Название слайса
  initialState,
  selectors: {
    selectOrders: (state): Order[] => state['orders'].orders,
    selectTotal: (state): number => state['orders'].total,
    selectTotalToday: (state): number => state['orders'].totalToday,
  },
  reducers: {
    // Управляющие редьюсеры
    connect: (state, action: PayloadAction<ConnectPayload>) => {
      const { socketType } = action.payload;
      state[socketType].isLoading = true;
      state[socketType].error = null;
    },
    disconnect: (state, action: PayloadAction<SocketType>) => {
      const socketType = action.payload;
      state[socketType].isConnected = false;
      state[socketType].orders = [];
      state[socketType].total = 0;
      state[socketType].totalToday = 0;
      state[socketType].isLoading = false;
    },
    // Событийные редьюсеры
    onOpen: (state, action: PayloadAction<SocketType>) => {
      const socketType = action.payload;
      state[socketType].isLoading = false;
      state[socketType].isConnected = true;
      state[socketType].error = null;
    },
    onOrder: (
      state,
      action: PayloadAction<{ orders: Order[]; total: number; totalToday: number }>
    ) => {
      // state.orders.push(action.payload.orders);
      state['orders'].orders = action.payload.orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      state['orders'].totalToday = action.payload.totalToday;
      state['orders'].total = action.payload.total;
    },
    onError: (state, action: PayloadAction<ErrorPayload>) => {
      const { socketType, message } = action.payload;
      state[socketType].error = message;
      state[socketType].isLoading = false;
    },
    onClose: (state, action: PayloadAction<SocketType>) => {
      const socketType = action.payload;
      state[socketType].isConnected = false;
      state[socketType].isLoading = false;
    },
  },
});

// Экспортируем экшены
export const { connect, disconnect, onOpen, onOrder, onError, onClose } =
  socketSlice.actions;

export const { selectOrders, selectTotal, selectTotalToday } = socketSlice.selectors;

// Экспортируем редьюсер (его мы позже подключим к store)
export default socketSlice.reducer;
