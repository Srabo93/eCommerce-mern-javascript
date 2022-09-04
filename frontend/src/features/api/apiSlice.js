import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem("authorization"));

      if (token) {
        headers.set("authorization", `Bearer ${token.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({}),
});
