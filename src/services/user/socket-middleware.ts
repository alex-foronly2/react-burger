import { refreshToken } from '@utils/tokens';

import { onOpen, onOrder, onError, onClose, connect, disconnect } from './socket-slice';

import type { Middleware, PayloadAction } from '@reduxjs/toolkit';

const SOCKET_URL = import.meta.env.VITE_SOCKET_KEY;

let ws: WebSocket | null = null;

let isConnected = false; // Флаг: считается ли пользователь подключённым?
const reconnectPeriod = 3000; // 3 секунды
let reconnectTimerId: ReturnType<typeof setTimeout> | number = 0;

export type RefreshPayload = {
  endpoint: string;
  token?: string;
};

const socketMiddleware = (withTokenRefresh = false): Middleware => {
  return (store) => (next) => (action) => {
    const { type } = action as PayloadAction<RefreshPayload>;

    if (type === 'socket/connect') {
      const { endpoint, token } = (action as PayloadAction<RefreshPayload>).payload;
      isConnected = true;

      // Закрываем старое соединение, если есть
      if (ws) {
        ws.close();
      }

      // Создаём новый WebSocket
      ws = new WebSocket(`${SOCKET_URL + endpoint}?token=${token}`);

      // Обработчик открытия соединения
      ws.onopen = (): void => {
        store.dispatch(onOpen());
      };

      // Обработчик входящих сообщений
      ws.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data = JSON.parse(event.data);
          console.log('Сообщение с сервера:', data);

          // Новая логика: проверяем токен
          if (withTokenRefresh && data.message === 'Invalid or missing token') {
            refreshToken()
              .then((refreshedData) => {
                store.dispatch(
                  connect({
                    endpoint: endpoint,
                    token: refreshedData.accessToken.replace('Bearer ', ''),
                  })
                );
              })
              .catch(() => {
                store.dispatch(onError('Не удалось обновить токен'));
              });

            store.dispatch(disconnect());
            return;
          }

          store.dispatch(onOrder(data));
        } catch (error) {
          console.error(error);
          store.dispatch(onError('Ошибка парсинга сообщения от сервера'));
        }
      };

      // Обработчик ошибок
      ws.onerror = (): void => {
        store.dispatch(onError('Ошибка WebSocket-соединения'));
      };

      // Обработчик закрытия соединения
      ws.onclose = (): void => {
        store.dispatch(onClose());
        ws = null;
        if (isConnected) {
          reconnectTimerId = setTimeout(() => {
            store.dispatch(connect({ endpoint: endpoint, token: token }));
          }, reconnectPeriod);
        }
      };
    }

    // Обработка экшена disconnect
    if (type === 'socket/disconnect') {
      isConnected = false;
      clearTimeout(reconnectTimerId);
      reconnectTimerId = 0;
      if (ws) {
        ws.close();
        ws = null;
      }
    }

    return next(action);
  };
};

export default socketMiddleware;
