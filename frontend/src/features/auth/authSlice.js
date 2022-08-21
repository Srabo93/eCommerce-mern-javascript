import { createSlice } from "@reduxjs/toolkit";
import { shopApi } from "../api/shopSlice";

const initialState = {
  user: null,
  token: null,
  shipping: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout() {
      localStorage.removeItem("authorization");
      return initialState;
    },
    isLoggedIn(state) {
      let isAuthorized = JSON.parse(localStorage.getItem("authorization"));
      if (isAuthorized) {
        state.user = isAuthorized.user;
        state.token = isAuthorized.token;
        state.shipping = isAuthorized.shipping;
        state.isAuthenticated = true;
      } else {
        return initialState;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(shopApi.endpoints.login.matchFulfilled, (state, action) => {
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
      .addMatcher(shopApi.endpoints.login.matchRejected, (state, action) => {
        console.log("rejected", action);
      })
      .addMatcher(
        shopApi.endpoints.register.matchFulfilled,
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
        shopApi.endpoints.updateUserCredentials.matchRejected,
        (state, action) => {
          console.log("rejected", action);
        }
      )
      .addMatcher(
        shopApi.endpoints.updateUserCredentials.matchFulfilled,
        (state, action) => {
          state.user = action.payload.name;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      );
  },
});

export const { logout, login, isLoggedIn } = authSlice.actions;
//this will return false always i guess, for now
export const selectAuthenticatedUser = (state) => state.auth;

export default authSlice.reducer;
