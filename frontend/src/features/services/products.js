import { api } from "./api";

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (pagination) => `/products?pagination=${pagination}`,
      providesTags: () => [{ type: "Product", id: "LIST" }],
    }),
    listProducts: builder.query({
      query: (page = 1) => `/products?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              ...result.docs.map((product) => ({
                type: "Product",
                id: product._id,
              })),
              { type: "Product", id: "PAGINATED-LIST" },
            ]
          : [{ type: "Product", id: "PAGINATED-LIST" }],
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
      providesTags: (id) => [
        { type: "Product", id: id },
        { type: "Product", id: "LIST" },
      ],
    }),
    createProduct: builder.mutation({
      query: (credentials) => ({
        url: "/products",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "PAGINATED-LIST" },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [
        { type: "Product", id: "PAGINATED-LIST" },
        { type: "Product", id: "LIST" },
      ],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: (id) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id: id },
      ],
    }),
    uploadImage: builder.mutation({
      query: (image) => ({
        url: "/upload",
        method: "POST",
        body: image,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    createReview: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/products/${id}/reviews`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: (id) => [{ type: "Product", id: id }],
    }),
    searchProduct: builder.query({
      query: (keyword) => ({
        url: `/products?keyword=${keyword}`,
      }),
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
