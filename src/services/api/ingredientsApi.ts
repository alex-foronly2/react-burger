import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Bun, Filling } from '@services/tasks/orderReducer';

const API_HEADERS = {
  'Content-Type': 'application/json',
};

const baseUrl = import.meta.env.VITE_API_KEY;

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      for (const [key, value] of Object.entries(API_HEADERS)) {
        headers.set(key, value);
      }
    },
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => ({
        url: '/api/ingredients',
        responseHandler: async (
          response
        ): Promise<{ success: boolean; data: Omit<Bun | Filling, 'uniqueId'>[] }> => {
          console.log(response);
          const json = await response.json();
          return json.data;
        },
      }),
    }),
  }),
});

export const { useGetIngredientsQuery } = ingredientsApi;
