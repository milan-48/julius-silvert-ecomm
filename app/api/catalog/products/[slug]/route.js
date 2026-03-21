import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/memoryDb/queries";

export async function GET(_request, context) {
  const { slug } = await context.params;
  const product = getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}
