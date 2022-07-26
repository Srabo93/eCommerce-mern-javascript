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
    },
    removeItem(state, { id }) {
      cartAdapter.remove(state, id);
    },
  },
});

export const {
  selectAll: selectAllItems,
  selectById: selectItemById,
  selectIds: selectItemIds,
} = cartAdapter.getSelectors((state) => state.cart);

export const { addItem, removeItem } = cartSlice.actions;

export default cartSlice.reducer;
