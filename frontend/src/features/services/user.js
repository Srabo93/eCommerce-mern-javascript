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
    }),
    updateUserById: builder.mutation({
      query: ({ id, ...credentials }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: credentials,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
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
