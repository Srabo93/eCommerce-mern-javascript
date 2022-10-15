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
    getAllOrders: builder.query({
      query: () => "/orders/myorders",
      providesTags: () => [{ type: "AllOrders" }],
    }),
    getOrders: builder.query({
      query: () => "/orders",
      providesTags: [{ type: "Order" }],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: [{ type: "Order" }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  usePayOrderMutation,
  useGetAllOrdersQuery,
} = ordersApi;
