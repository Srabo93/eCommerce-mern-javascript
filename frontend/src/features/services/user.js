import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/users",
        method: "POST",
        body: credentials,
      }),
    }),
    updateUserCredentials: builder.mutation({
      query: (credentials) => ({
        url: "/users/profile",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserById: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: [{ type: "User" }],
    }),
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: [{ type: "User" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useLoginMutation,
  useRegisterMutation,
  useDeleteUserMutation,
  useUpdateUserByIdMutation,
  useUpdateUserCredentialsMutation,
} = userApi;
