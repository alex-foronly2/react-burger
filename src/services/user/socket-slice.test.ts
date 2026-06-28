import { describe, it, expect, vi, type Mock, type MockInstance } from 'vitest';

import { testName } from '@services/user/slice.moke';

import socketMiddleware from './socket-middleware';
import { onOpen, selectOrders, selectTotal, selectTotalToday } from './socket-slice';

import type { UnknownAction, MiddlewareAPI, Dispatch } from '@reduxjs/toolkit';

import type * as SocketSlice from './socket-slice';

type MockStoreResult = {
  store: MiddlewareAPI<Dispatch<UnknownAction>, unknown> & {
    getState: Mock<() => unknown>;
    dispatch: Mock<(action: UnknownAction) => unknown>;
  };
  next: Mock<(action: unknown) => unknown>;
};

const createMockStore = (): MockStoreResult => {
  const store = {
    getState: vi.fn(),
    dispatch: vi.fn(),
  };
  const next = vi.fn();
  return { store, next } as unknown as MockStoreResult;
};

vi.mock('./socket-slice', async (importOriginal) => {
  const actual = await importOriginal<typeof SocketSlice>();
  return {
    ...actual,
    onOpen: (socketType: string): { type: string; payload: string } => ({
      type: 'socket/onOpen',
      payload: socketType,
    }),
    onError: (
      socketType: string
    ): { type: string; payload: { message: string; socketType: string } } => ({
      type: 'socket/onError',
      payload: { message: 'test', socketType },
    }),
  };
});

describe('socketMiddleware', () => {
  let mockWebSocket: WebSocket;
  let logSpy: MockInstance;

  beforeEach(() => {
    vi.restoreAllMocks();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => void 0);

    mockWebSocket = {
      close: vi.fn(),
      onopen: null,
      onmessage: null,
      onerror: null,
    } as unknown as WebSocket;

    vi.stubGlobal(
      'WebSocket',
      vi.fn(() => mockWebSocket)
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    logSpy.mockRestore();
  });

  it('должен открыть WebSocket и вызвать store.dispatch(onOpen) при успешном соединении', () => {
    const { store, next } = createMockStore();

    const middleware = socketMiddleware(false)(store)(next);

    const action = {
      type: 'socket/connect',
      payload: {
        endpoint: '/test',
        socketType: 'orders',
      },
    };

    middleware(action);

    expect(next).toHaveBeenCalledWith(action);

    expect(global.WebSocket).toHaveBeenCalled();

    if (mockWebSocket.onopen) {
      mockWebSocket.onopen(new Event('open'));
    }
    expect(store.dispatch).toHaveBeenCalledWith(onOpen('orders'));

    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage(
        new MessageEvent('message', {
          data: '{"test":"test"}',
        })
      );
    }

    expect(logSpy).toHaveBeenCalledWith('Сообщение с сервера:', { test: 'test' });

    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage(
        new MessageEvent('message', {
          data: '{"message":"Invalid or missing token"}',
        })
      );
    }
    expect(logSpy).not.toHaveBeenCalledWith('refresh token');
  });

  it('должен открыть WebSocket, вызвать onOpen и вызвать обновление токена', () => {
    const { store, next } = createMockStore();

    const middleware = socketMiddleware(true)(store)(next);

    const action = {
      type: 'socket/connect',
      payload: {
        endpoint: '/test',
        socketType: 'orders',
      },
    };

    middleware(action);

    expect(next).toHaveBeenCalledWith(action);

    expect(global.WebSocket).toHaveBeenCalled();

    if (mockWebSocket.onopen) {
      mockWebSocket.onopen(new Event('open'));
    }
    expect(store.dispatch).toHaveBeenCalledWith(onOpen('orders'));

    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage(
        new MessageEvent('message', {
          data: '{"test":"test"}',
        })
      );
      // mockWebSocket.onmessage({ data: '{"test":"test"}' });
    }

    expect(logSpy).toHaveBeenCalledWith('Сообщение с сервера:', { test: 'test' });

    if (mockWebSocket.onmessage) {
      mockWebSocket.onmessage(
        new MessageEvent('message', {
          data: '{"message":"Invalid or missing token"}',
        })
      );
      // mockWebSocket.onmessage({ data: '{"message":"Invalid or missing token"}' });
    }
    expect(logSpy).toHaveBeenCalledWith('refresh token');
  });
});

describe('Selectors', () => {
  const order = {
    createdAt: '2026-06-06T10:33:43.723Z',
    ingredients: ['_1'],
    name: testName,
    number: 1,
    status: 'done' as SocketSlice.Status,
    updatedAt: '2026-06-06T10:33:43.723Z',
    _id: '_123',
  };
  const mockState = {
    socket: {
      orders: {
        orders: [order],
        total: 100,
        totalToday: 10,
        isConnected: false,
        error: null,
        isLoading: false,
      },
    },
  };
  it('должен возвращать список заказов', () => {
    const result = selectOrders(mockState);
    expect(result).toEqual([order]);
  });

  it('должен возвращать общее количество заказов', () => {
    const result = selectTotal(mockState);
    expect(result).toEqual(100);
  });

  it('должен возвращать количество заказов за сегодня', () => {
    const result = selectTotalToday(mockState);
    expect(result).toEqual(10);
  });
});
