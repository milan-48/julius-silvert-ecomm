"use client";

import { useEffect, useState } from "react";
import { useStore } from "react-redux";
import { rehydrateCart, selectCartItems } from "@/lib/store/cartSlice";
import {
  loadCartFromStorage,
  saveCartToStorage,
} from "@/lib/store/cartPersistence";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

const SAVE_DEBOUNCE_MS = 400;

/**
 * Loads cart from browser storage once, then debounces writes on every items change.
 * Uses `useStore` for flush handlers so we always persist the latest state.
 */
export function CartPersistence() {
  const dispatch = useAppDispatch();
  const store = useStore();
  const items = useAppSelector(selectCartItems);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadCartFromStorage();
    if (loaded.length > 0) {
      dispatch(rehydrateCart({ items: loaded }));
    }
    setHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => {
      saveCartToStorage(store.getState().cart.items);
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [items, hydrated, store]);

  useEffect(() => {
    if (!hydrated) return;
    const flush = () => saveCartToStorage(store.getState().cart.items);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hydrated, store]);

  return null;
}
