import { api } from "./api";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (credentials) => ({
        url: "/orders",
        method: "POST",
        body: credentials,
      }),
    }),
    payOrder: builder.mutation({
      query: ({ orderId, ...rest }) => ({
        url: `/orders/${orderId}/pay`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, arg) => [{ type: "Order" }],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderQuery, usePayOrderMutation } =
  ordersApi;
