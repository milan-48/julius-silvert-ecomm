import { NextResponse } from "next/server";
import { listCategories } from "@/lib/memoryDb/queries";

export async function GET() {
  const categories = listCategories();
  return NextResponse.json({ categories });
}
