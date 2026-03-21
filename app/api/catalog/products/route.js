import { NextResponse } from "next/server";
import {
  listAllProducts,
  listProductsByCategory,
} from "@/lib/memoryDb/queries";
import { withStockView } from "@/lib/memoryDb/stockUtils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const raw = category
    ? listProductsByCategory(category)
    : listAllProducts();

  const products = raw.map((p) => withStockView(p));

  return NextResponse.json({ products, category: category ?? null });
}
