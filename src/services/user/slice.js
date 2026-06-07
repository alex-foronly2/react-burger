import { createSlice } from '@reduxjs/toolkit';

import { authApi } from '../api/authApi.js';

const defaultUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;
const initialState = {
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
    setFormValue: (state, action) => {
      state.form[action.payload.field] = action.payload.value;
    },
    setUserFormValue: (state, action) => {
      state.userForm[action.payload.field] = action.payload.value;
    },
    setPasswordFormValue: (state, action) => {
      state.passwordForm[action.payload.field] = action.payload.value;
    },
    initUserForm: (state) => {
      state.userForm = state.user;
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
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    sendingSelector: (state) => state.sending,
    sendErrorSelector: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = state.userForm = action.payload;
        state.isAuthChecked = true;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.user = state.userForm = action.payload;
        state.isAuthChecked = true;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = state.userForm = null;
        state.isAuthChecked = true;
      })
      .addMatcher(authApi.endpoints.updateUser.matchFulfilled, (state, action) => {
        if (action && action.payload) {
          state.user = state.userForm = action.payload;
        }
      });
    // .addMatcher(authApi.endpoints.updateUser.matchRejected,(state, action) => {
    //     console.log("matchRejected");
    //     console.log(action);
    //   },
    // )
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
} = authSlice.selectors;
