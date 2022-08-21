import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const cartAdapter = createEntityAdapter({
  selectId: (payload) => payload.product._id,
});

const initialState = cartAdapter.getInitialState({ shipping: null });

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addShipping(state, { payload }) {
      state.shipping = payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    addItem(state, { payload }) {
      cartAdapter.setOne(state, payload);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeItem(state, { payload }) {
      cartAdapter.removeOne(state, payload);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    updateQty(state, { payload }) {
      cartAdapter.updateOne(state, payload);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    loadCart(state) {
      let cartItems = JSON.parse(localStorage.getItem("cart"));
      if (cartItems !== null) {
        cartAdapter.setAll(state, cartItems.entities);
        state.shipping = cartItems.shipping;
      } else {
        return initialState;
      }
    },
  },
});

export const {
  selectAll: selectAllItems,
  selectById: selectItemById,
  selectIds: selectItemIds,
} = cartAdapter.getSelectors((state) => state.cart);

export const { addItem, removeItem, updateQty, loadCart, addShipping } =
  cartSlice.actions;

export default cartSlice.reducer;
