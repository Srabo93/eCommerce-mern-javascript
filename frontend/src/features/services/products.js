import { api } from "./api";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product" }],
    }),
    createProduct: builder.mutation({
      query: (credentials) => ({
        url: "/products",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Product" }],
    }),
    uploadImage: builder.mutation({
      query: (image) => ({
        url: "/upload",
        method: "POST",
        body: image,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    createReview: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/products/${id}/reviews`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Product" }],
    }),
    searchProduct: builder.query({
      query: (keyword) => ({
        url: `/products?keyword=${keyword}`,
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useSearchProductQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUploadImageMutation,
} = productApi;
