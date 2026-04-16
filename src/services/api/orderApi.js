import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_HEADERS = {
  'Content-Type': 'application/json',
};

const baseUrl = import.meta.env.VITE_API_KEY;

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      for (let [key, value] of Object.entries(API_HEADERS)) {
        headers.set(key, value);
      }
    },
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/api/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ORDER'],
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
