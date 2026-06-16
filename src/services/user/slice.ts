import { createSlice } from '@reduxjs/toolkit';

import { authApi } from '../api/authApi.js';

import type { PayloadAction } from '@reduxjs/toolkit';

const defaultUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user') ?? '')
  : null;

type User = {
  name?: string;
  email?: string;
  password?: string;
};

type Password = {
  password?: string;
  token?: string;
};

type Error = {
  data: {
    message: string;
  };
};

type Form = {
  email: string;
  password: string;
};

type SliceState = {
  form: Form;
  user: User | null;
  userForm: User;
  passwordForm: Password;
  isAuthChecked: boolean;
  error: Error | null;
  sending: boolean;
};

const initialState: SliceState = {
  form: {
    email: '',
    password: '',
  },
  user: defaultUser,
  userForm: defaultUser || {},
  passwordForm: {},
  isAuthChecked: false,
  error: null,
  sending: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFormValue: (
      state,
      action: PayloadAction<{ field: string; value: string | number | boolean | null }>
    ) => {
      const formStringValue =
        action.payload.value !== null && action.payload.value !== undefined
          ? String(action.payload.value)
          : '';
      state.form[action.payload.field as keyof Form] = formStringValue;
    },
    setUserFormValue: (
      state,
      action: PayloadAction<{ field: string; value: string | number | boolean | null }>
    ) => {
      const userFormStringValue =
        action.payload.value !== null && action.payload.value !== undefined
          ? String(action.payload.value)
          : '';
      state.userForm[action.payload.field as keyof User] = userFormStringValue;
    },
    setPasswordFormValue: (
      state,
      action: PayloadAction<{ field: string; value: string | number | boolean | null }>
    ) => {
      const passwordFormStringValue =
        action.payload.value !== null && action.payload.value !== undefined
          ? String(action.payload.value)
          : '';
      state.passwordForm[action.payload.field as keyof Password] =
        passwordFormStringValue;
    },
    initUserForm: (state) => {
      state.userForm = state.user ?? {};
      state.userForm.password = '';
    },
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  selectors: {
    authSelector: (state) => state.form,
    userSelector: (state) => state.user,
    userFormSelector: (state) => state.userForm,
    passwordFormSelector: (state) => state.passwordForm,
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    sendingSelector: (state) => state.sending,
    sendErrorSelector: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = state.userForm = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = state.userForm = action.payload;
          state.isAuthChecked = true;
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.userForm = {};
        state.isAuthChecked = true;
      })
      .addMatcher(
        authApi.endpoints.updateUser.matchFulfilled,
        (state, action: PayloadAction<User>) => {
          if (action && action.payload) {
            state.user = state.userForm = action.payload;
          }
        }
      );
  },
});

export const { setFormValue, setUserFormValue, setPasswordFormValue, initUserForm } =
  authSlice.actions;
export const {
  authSelector,
  sendErrorSelector,
  sendingSelector,
  isAuthCheckedSelector,
  userSelector,
  userFormSelector,
  passwordFormSelector,
} = authSlice.selectors;
