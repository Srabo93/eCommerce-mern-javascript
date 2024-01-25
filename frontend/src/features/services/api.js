import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: "https://proshop.srabodev.de/api",
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem("authorization"));

      if (token) {
        headers.set("authorization", `Bearer ${token.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product", "Order", "UserOrders", "User"],
  endpoints: (builder) => ({}),
});
