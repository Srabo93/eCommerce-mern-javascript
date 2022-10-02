import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { api } from "./api";

const productsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  selectId: (response) => response._id,
});

const initialState = productsAdapter.getInitialState();

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      transformResponse: (responseData) => {
        return productsAdapter.setAll(initialState, responseData);
      },
      providesTags: () => [{ type: "Product" }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product" }],
    }),
  }),
});

export const { useGetProductsQuery, useDeleteProductMutation } = productApi;

export const selectProductsResult = productApi.endpoints.getProducts.select();

const selectProductsData = createSelector(
  selectProductsResult,
  (productsResult) => productsResult.data
);

export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds,
} = productsAdapter.getSelectors(
  (state) => selectProductsData(state) ?? initialState
);
