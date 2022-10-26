import { api } from "./api";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (pagination) => `/products?pagination=${pagination}`,
      providesTags: (result) =>
        result
          ? [
              ...result?.docs.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),
    listProducts: builder.query({
      query: (page = 1) => `/products?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.docs?.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Product", id: "PARTIAL-LIST" }],
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
      invalidatesTags: (result, error, id) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "PARTIAL-LIST" },
      ],
    }),
    createProduct: builder.mutation({
      query: (credentials) => ({
        url: "/products",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "PARTIAL-LIST" },
      ],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "PARTIAL-LIST" },
      ],
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
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    searchProduct: builder.query({
      query: (keyword) => ({
        url: `/products?keyword=${keyword}`,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "PARTIAL-LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useListProductsQuery,
  useGetProductQuery,
  useSearchProductQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUploadImageMutation,
} = productApi;
