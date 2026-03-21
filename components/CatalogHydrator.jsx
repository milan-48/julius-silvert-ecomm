"use client";

import { useEffect } from "react";
import { fetchCatalogCategories } from "@/lib/store/catalogSlice";
import { useAppDispatch } from "@/lib/store/hooks";

/**
 * Loads the single category menu from the in-memory API into Redux on app start.
 */
export function CatalogHydrator() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCatalogCategories());
  }, [dispatch]);
  return null;
}
