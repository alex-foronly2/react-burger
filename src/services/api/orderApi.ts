import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithRefresh } from '@services/api/authApi';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['ORDER'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: 'api/orders',
        method: 'POST',
        body: JSON.stringify(data),
      }),
      invalidatesTags: ['ORDER'],
      transformResponse: async (response) => {
        const data = await response.json();

        if (!data.success) {
          return null;
        }
        return data;
      },
    }),
    getTheOrder: builder.query({
      query: (data: string) => ({
        url: '/api/orders/' + data,
        method: 'GET',
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetTheOrderQuery } = orderApi;
