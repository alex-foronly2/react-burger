import { describe, expect, it } from 'vitest';

import { SHOW_POPUP, HIDE_POPUP } from './actions.js';
import { modalReducer } from './modalReducer';

describe('Reducers', () => {
  it('должен отображать попап заказа', () => {
    const result = modalReducer(undefined, {
      type: SHOW_POPUP,
      payload: { type: 'order' },
    });
    expect(result.info).toBeFalsy();
    expect(result.order).toBeTruthy();
  });

  it('должен отображать попап информации об ингредиенте', () => {
    const result = modalReducer(undefined, {
      type: SHOW_POPUP,
      payload: { type: 'info' },
    });
    expect(result.info).toBeTruthy();
    expect(result.order).toBeFalsy();
  });
  it('должен скрывать попап информации о заказе', () => {
    const result = modalReducer({ info: false, order: true }, { type: HIDE_POPUP });
    expect(result.info).toBeFalsy();
    expect(result.order).toBeFalsy();
  });
  it('должен скрывать попап информации об ингредиенте', () => {
    const result = modalReducer({ info: true, order: false }, { type: HIDE_POPUP });
    expect(result.info).toBeFalsy();
    expect(result.order).toBeFalsy();
  });
});
