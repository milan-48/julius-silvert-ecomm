"use client";

import { useEffect, useRef } from "react";
import { rehydrateWishlist } from "@/lib/store/wishlistSlice";
import { lastWishlistMutationAt } from "@/lib/store/wishlistMutationClock";
import { useAppDispatch } from "@/lib/store/hooks";

/**
 * Loads wishlist from server in-memory store on app load so refresh keeps saved hearts.
 * Skips applying a stale GET if the user already toggled wishlist before this response arrived.
 */
export function WishlistPersistence() {
  const dispatch = useAppDispatch();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const fetchStartedAt = Date.now();
    (async () => {
      try {
        const r = await fetch("/api/wishlist", { cache: "no-store" });
        const d = await r.json();
        if (!r.ok || !Array.isArray(d.items)) return;
        if (lastWishlistMutationAt > fetchStartedAt) return;
        dispatch(rehydrateWishlist(d.items));
      } catch {
        /* ignore */
      }
    })();
  }, [dispatch]);

  return null;
}
