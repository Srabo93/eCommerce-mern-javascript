import { api } from "./api";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      //for users!
      query: () => "/orders/myorders",
      providesTags: ["UserOrders"],
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
      providesTags: (id) => [
        { type: "Order", id: id },
        { type: "Order", id: "LIST" },
      ],
    }),
    createOrder: builder.mutation({
      query: (credentials) => ({
        url: "/orders",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }, { type: "UserOrders" }],
    }),
    payOrder: builder.mutation({
      query: ({ orderId, ...rest }) => ({
        url: `/orders/${orderId}/pay`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Order", id: id },
        { type: "UserOrders" },
      ],
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/${orderId}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: ({ id }) => [{ type: "Order", id: id }],
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
