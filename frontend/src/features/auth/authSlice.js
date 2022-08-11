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
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(shopApi.endpoints.login.matchPending, (state, action) => {
        console.log("pending", action);
      })
      .addMatcher(shopApi.endpoints.login.matchFulfilled, (state, action) => {
        console.log("fulfilled", action);
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addMatcher(shopApi.endpoints.login.matchRejected, (state, action) => {
        console.log("rejected", action);
      });
  },
});

export const { logout } = authSlice.actions;
//this will return false always i guess, for now
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
