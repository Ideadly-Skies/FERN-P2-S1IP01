// redux/features/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserCart, saveUserCart } from "../../../utils/cartFirestore";

export const loadCart = createAsyncThunk("cart/loadCart", async (uid) => {
  const cart = await fetchUserCart(uid);
  return cart;
});

export const persistCart = createAsyncThunk("cart/persistCart", async ({ uid, cart }) => {
  await saveUserCart(uid, cart);
  return cart ;
});

const initialState = {
  items: [],
  initialized: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find(p => p.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find(p => p.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find(p => p.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    setCartFromDB: (state, action) => {
      state.items = action.payload;
      state.initialized = true;
    },
    clearCart: (state) => {
      state.items = [];
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCart.fulfilled, (state, action) => {
      state.items = action.payload;
      state.initialized = true;
    });
  }
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  setCartFromDB,
} = cartSlice.actions;

export default cartSlice.reducer;