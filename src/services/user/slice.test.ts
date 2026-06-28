import { describe, it, expect } from 'vitest';

import { testName, testEmail, testPassword } from '@services/user/slice.moke';

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
          email: testEmail,
          password: testPassword,
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
      email: testEmail,
      password: testPassword,
    });
  });
  it('должен возвращать user', () => {
    const mockState = {
      auth: {
        form: {
          email: testEmail,
          password: testPassword,
        },
        user: {
          name: testName,
          email: testEmail,
        },
        userForm: {},
        passwordForm: {},
        isAuthChecked: false,
        error: null,
        sending: false,
      },
    };

    const result = userSelector(mockState);
    expect(result).toEqual({ name: testName, email: testEmail });
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
      setPasswordFormValue({ field: 'password', value: testPassword })
    );
    expect(result.passwordForm).toEqual({ password: testPassword });
  });
  it('должен задавать значение форме данных пользователя', () => {
    const result = authReducer(
      undefined,
      setUserFormValue({ field: 'name', value: testName })
    );
    expect(result.userForm).toEqual({ name: testName });
  });
  it('должен задавать значение форме входа', () => {
    const result = authReducer(
      undefined,
      setFormValue({ field: 'email', value: testEmail })
    );
    expect(result.form).toEqual({ email: testEmail, password: '' });
  });
});
