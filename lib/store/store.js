import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import catalogReducer from "./catalogSlice";
import wishlistReducer from "./wishlistSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
      catalog: catalogReducer,
      wishlist: wishlistReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}
