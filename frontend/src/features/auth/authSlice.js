import { createSlice } from "@reduxjs/toolkit";
import { shopApi } from "../api/shopSlice";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout() {
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
      .addMatcher(shopApi.endpoints.login.matchPending, (state, action) => {
        console.log("pending", action);
      })
      .addMatcher(shopApi.endpoints.login.matchFulfilled, (state, action) => {
        console.log("fulfilled", action);
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
      });
  },
});

export const { logout, isLoggedIn } = authSlice.actions;
//this will return false always i guess, for now
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
