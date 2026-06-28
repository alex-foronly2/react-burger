import { describe, it, expect } from 'vitest';

import authReducer, {
  authSelector,
  userSelector,
  initUserForm,
  setFormValue,
  setPasswordFormValue,
  setUserFormValue,
} from './slice';

describe('Selectors', () => {
  it('должен возвращать initial state', () => {
    const mockState = {
      auth: {
        form: {
          email: 'test@mail.ru',
          password: '123456',
        },
        user: null,
        userForm: {},
        passwordForm: {},
        isAuthChecked: false,
        error: null,
        sending: false,
      },
    };

    const result = authSelector(mockState);

    expect(result).toEqual({
      email: 'test@mail.ru',
      password: '123456',
    });
  });
  it('должен возвращать user', () => {
    const mockState = {
      auth: {
        form: {
          email: 'test@mail.ru',
          password: '123456',
        },
        user: {
          name: 'test',
          email: 'test@mail.ru',
        },
        userForm: {},
        passwordForm: {},
        isAuthChecked: false,
        error: null,
        sending: false,
      },
    };

    const result = userSelector(mockState);
    expect(result).toEqual({ name: 'test', email: 'test@mail.ru' });
  });
});

describe('Reducers', () => {
  it('должен инициировать форму', () => {
    const result = authReducer(undefined, initUserForm());
    expect(result.userForm).toEqual({ password: '' });
  });
  it('должен задавать значение форме смены пароля', () => {
    const result = authReducer(
      undefined,
      setPasswordFormValue({ field: 'password', value: '123456' })
    );
    expect(result.passwordForm).toEqual({ password: '123456' });
  });
  it('должен задавать значение форме данных пользователя', () => {
    const result = authReducer(
      undefined,
      setUserFormValue({ field: 'name', value: 'Ivan' })
    );
    expect(result.userForm).toEqual({ name: 'Ivan' });
  });
  it('должен задавать значение форме входа', () => {
    const result = authReducer(
      undefined,
      setFormValue({ field: 'email', value: 'test@mail.ru' })
    );
    expect(result.form).toEqual({ email: 'test@mail.ru', password: '' });
  });
});
