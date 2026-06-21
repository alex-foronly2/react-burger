import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RefreshPayload } from './socket-middleware';

// Интерфейсы для данных

type Status = 'done' | 'pending' | 'created';

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

// Начальное состояние
const initialState: SocketState = {
  isConnected: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  isLoading: false,
};

// Создаём слайс
const socketSlice = createSlice({
  name: 'socket', // Название слайса
  initialState,
  selectors: {
    selectOrders: (state): Order[] => state.orders,
    selectTotal: (state): number => state.total,
    selectTotalToday: (state): number => state.totalToday,
  },
  reducers: {
    // Управляющие редьюсеры
    connect: (state, _action: PayloadAction<RefreshPayload>) => {
      state.isLoading = true;
      state.error = null;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.isLoading = false;
    },
    // Событийные редьюсеры
    onOpen: (state) => {
      state.isLoading = false;
      state.isConnected = true;
      state.error = null;
    },
    onOrder: (
      state,
      action: PayloadAction<{ orders: Order[]; total: number; totalToday: number }>
    ) => {
      // state.orders.push(action.payload.orders);
      state.orders = action.payload.orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      state.totalToday = action.payload.totalToday;
      state.total = action.payload.total;
    },
    onError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    onClose: (state) => {
      state.isConnected = false;
      state.isLoading = false;
    },
  },
});

// Экспортируем экшены
export const { connect, disconnect, onOpen, onOrder, onError, onClose } =
  socketSlice.actions;

export const { selectOrders, selectTotal, selectTotalToday } = socketSlice.selectors;

// Экспортируем редьюсер (его мы позже подключим к store)
export default socketSlice.reducer;
