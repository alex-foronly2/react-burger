import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchWithRefresh } from '@utils/tokens';

const API_HEADERS = {
  'Content-Type': 'application/json',
};

const baseUrl = import.meta.env.VITE_API_KEY;
type queryArgs = {
  url: string;
  method?: string;
};

async function baseQueryWithRefresh<T>(args: queryArgs): Promise<{ data: T }> {
  const { url, method = 'GET', ...rest } = args;
  const token = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(API_HEADERS)) {
    headers[key] = value;
  }

  if (token) {
    headers.authorization = token;
  }

  const options = {
    method,
    headers,
    ...rest,
  };

  const data = await fetchWithRefresh(baseUrl + url, options);
  return { data };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'api/auth/login',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      transformResponse: async (response) => {
        const data = await response.json();
        if (!data.success) {
          return null;
        }
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      },
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: 'api/auth/register',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      transformResponse: async (response) => {
        const data = await response.json();
        if (!data.success) {
          return null;
        }
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      },
    }),
    updateUser: builder.mutation({
      query: (credentials) => ({
        url: 'api/auth/user',
        method: 'PATCH',
        body: JSON.stringify(credentials),
      }),
      transformResponse: async (response) => {
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      },
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: 'api/password-reset',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      transformResponse: async (response) => {
        const data = await response.json();
        if (!data.success) {
          return null;
        }
        localStorage.setItem('resetSent', '1');
        return data;
      },
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: 'api/password-reset/reset',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      transformResponse: async (response) => {
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        localStorage.removeItem('resetSent');
        return data;
      },
    }),
    logout: builder.mutation({
      query: (credentials) => ({
        url: 'api/auth/logout',
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
      transformResponse: async (response) => {
        const data = await response.json();
        if (!data.success) {
          return null;
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return true;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
} = authApi;

export type BackendErrorData = {
  message?: string;
};
