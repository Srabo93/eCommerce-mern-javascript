import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const cartAdapter = createEntityAdapter({
  selectId: (item) => item.itemId,
});

const initialState = cartAdapter.getInitialState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      cartAdapter.addOne(state, action.payload);
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

export const { addItem, removeItem, updateQty, loadCart } = cartSlice.actions;

export default cartSlice.reducer;
