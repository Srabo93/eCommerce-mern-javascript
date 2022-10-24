import { api } from "./api";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      //for users!
      query: () => "/orders/myorders",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "AllOrders", id })),
              { type: "AllOrders", id: "LIST" },
            ]
          : [{ type: "AllOrders", id: "LIST" }],
    }),
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Order", id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    createOrder: builder.mutation({
      query: (credentials) => ({
        url: "/orders",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    payOrder: builder.mutation({
      query: ({ orderId, ...rest }) => ({
        url: `/orders/${orderId}/pay`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
  useGetAllOrdersQuery,
} = ordersApi;
