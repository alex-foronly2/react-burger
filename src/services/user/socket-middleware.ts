import { refreshToken } from '@utils/tokens';

import { onOpen, onOrder, onError, onClose, connect, disconnect } from './socket-slice';

import type { Middleware, PayloadAction } from '@reduxjs/toolkit';

const SOCKET_URL = import.meta.env.VITE_SOCKET_KEY;

export type SocketType = string;

//let ws: WebSocket | null = null;
const ws: Record<string, WebSocket> = {};

let isConnected = false; // Флаг: считается ли пользователь подключённым?
const reconnectPeriod = 3000; // 3 секунды
let reconnectTimerId: ReturnType<typeof setTimeout> | number = 0;

export type ConnectPayload = {
  endpoint: string;
  socketType: SocketType;
};

const socketMiddleware = (withTokenRefresh = false): Middleware => {
  return (store) => (next) => (action) => {
    const { type } = action as PayloadAction<ConnectPayload>;

    if (type === 'socket/connect') {
      const { endpoint, socketType } = (action as PayloadAction<ConnectPayload>).payload;
      isConnected = true;

      // Закрываем старое соединение, если есть
      if (ws && Object.hasOwn(ws, socketType)) {
        ws[socketType].close();
      }

      // Создаём новый WebSocket
      ws[socketType] = new WebSocket(`${SOCKET_URL + endpoint}`);

      // Обработчик открытия соединения
      ws[socketType].onopen = (): void => {
        store.dispatch(onOpen(socketType));
      };

      // Обработчик входящих сообщений
      ws[socketType].onmessage = (event: MessageEvent<string>): void => {
        try {
          const data = JSON.parse(event.data);
          console.log('Сообщение с сервера:', data);

          // Новая логика: проверяем токен
          if (withTokenRefresh && data.message === 'Invalid or missing token') {
            refreshToken()
              .then((refreshedData) => {
                store.dispatch(
                  connect({
                    endpoint:
                      endpoint.split('token=')[0] +
                      'token=' +
                      refreshedData.accessToken.replace('Bearer ', ''),
                    socketType: socketType,
                  })
                );
              })
              .catch(() => {
                store.dispatch(
                  onError({ message: 'Не удалось обновить токен', socketType })
                );
              });

            store.dispatch(disconnect(socketType));
            return;
          }

          store.dispatch(onOrder(data));
        } catch (error) {
          console.error(error);
          store.dispatch(
            onError({ message: 'Ошибка парсинга сообщения от сервера', socketType })
          );
        }
      };

      // Обработчик ошибок
      ws[socketType].onerror = (): void => {
        store.dispatch(onError({ message: 'Ошибка WebSocket-соединения', socketType }));
      };

      // Обработчик закрытия соединения
      ws[socketType].onclose = (): void => {
        store.dispatch(onClose(socketType));
        delete ws[socketType]; // = null;
        if (isConnected) {
          reconnectTimerId = setTimeout(() => {
            store.dispatch(connect({ endpoint: endpoint, socketType: socketType }));
          }, reconnectPeriod);
        }
      };
    }

    // Обработка экшена disconnect
    if (type === 'socket/disconnect') {
      const socketType = (action as PayloadAction<string>).payload;
      isConnected = false;
      clearTimeout(reconnectTimerId);
      reconnectTimerId = 0;
      if (ws && Object.hasOwn(ws, socketType)) {
        ws[socketType].close();
        delete ws[socketType];
        //ws = null;
      }
    }

    return next(action);
  };
};

export default socketMiddleware;
