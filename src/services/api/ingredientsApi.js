import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_HEADERS = {
  'Content-Type': 'application/json',
};

const baseUrl = import.meta.env.VITE_API_KEY;

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      for (let [key, value] of Object.entries(API_HEADERS)) {
        headers.set(key, value);
      }
    },
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => ({
        url: '/api/ingredients',
        responseHandler: async (response) => {
          console.log(response);
          const json = await response.json();
          return json.data;
        },
      }),
    }),
  }),
});

export const { useGetIngredientsQuery } = ingredientsApi;
