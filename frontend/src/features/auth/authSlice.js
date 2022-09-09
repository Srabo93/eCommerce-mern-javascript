import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../services/user";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout() {
      localStorage.removeItem("authorization");
      localStorage.removeItem("cart");
      return initialState;
    },
    isLoggedIn(state) {
      let isAuthorized = JSON.parse(localStorage.getItem("authorization"));
      if (isAuthorized) {
        state.user = isAuthorized.user;
        state.token = isAuthorized.token;
        state.isAuthenticated = true;
      } else {
        return initialState;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
        localStorage.setItem(
          "authorization",
          JSON.stringify({
            token: action.payload.token,
            user: action.payload.name,
          })
        );
        state.user = action.payload.name;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addMatcher(userApi.endpoints.login.matchRejected, (state, action) => {
        console.log("rejected", action);
      })
      .addMatcher(
        userApi.endpoints.register.matchFulfilled,
        (state, action) => {
          localStorage.setItem(
            "authorization",
            JSON.stringify({
              token: action.payload.token,
              user: action.payload.name,
            })
          );
          state.user = action.payload.name;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(
        userApi.endpoints.updateUserCredentials.matchRejected,
        (state, action) => {
          console.log("rejected", action);
        }
      )
      .addMatcher(
        userApi.endpoints.updateUserCredentials.matchFulfilled,
        (state, action) => {
          state.user = action.payload.name;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      );
  },
});

export const { logout, login, isLoggedIn } = authSlice.actions;

export const selectAuthenticatedUser = (state) => state.auth;

export default authSlice.reducer;
