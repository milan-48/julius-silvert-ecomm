import { NextResponse } from "next/server";
import {
  listAllProducts,
  listProductsByCategory,
} from "@/lib/memoryDb/queries";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const products = category
    ? listProductsByCategory(category)
    : listAllProducts();

  return NextResponse.json({ products, category: category ?? null });
}
