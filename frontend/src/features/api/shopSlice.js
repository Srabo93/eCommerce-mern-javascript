import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const shopAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  selectId: (response) => response._id,
});

const initialState = shopAdapter.getInitialState();

export const shopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/users",
        method: "POST",
        body: credentials,
      }),
    }),
    updateUserCredentials: builder.mutation({
      query: (credentials) => ({
        url: "/users/profile",
        method: "PUT",
        body: credentials,
      }),
    }),
    getProducts: builder.query({
      query: () => "/products",
      transformResponse: (responseData) => {
        return shopAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => [
        { type: "Product", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Product", id })),
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserCredentialsMutation,
} = shopApi;

export const selectProductsResult = shopApi.endpoints.getProducts.select();

const selectProductsData = createSelector(
  selectProductsResult,
  (productsResult) => productsResult.data
);

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
} = shopAdapter.getSelectors(
  (state) => selectProductsData(state) ?? initialState
);
