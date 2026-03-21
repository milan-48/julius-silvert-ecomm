import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCatalogCategories = createAsyncThunk(
  "catalog/fetchCategories",
  async () => {
    const res = await fetch("/api/catalog/categories");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
);

const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    /** Single menu source for app code / future nav UI */
    categories: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setCategoriesFromServer(state, action) {
      state.categories = action.payload ?? [];
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalogCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCatalogCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload.categories ?? [];
      })
      .addCase(fetchCatalogCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed";
      });
  },
});

export const { setCategoriesFromServer } = catalogSlice.actions;
export const selectCatalogCategories = (state) => state.catalog.categories;
export const selectCatalogStatus = (state) => state.catalog.status;

export default catalogSlice.reducer;
