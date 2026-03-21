import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import catalogReducer from "./catalogSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
      catalog: catalogReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}
