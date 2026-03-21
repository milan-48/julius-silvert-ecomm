import { NextResponse } from "next/server";
import {
  getWishlistSnapshot,
  wishlistMemoryRemoveSku,
  wishlistMemoryToggle,
} from "@/lib/memoryDb/wishlistMemoryStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ items: getWishlistSnapshot() });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body?.action;
  if (action === "toggle") {
    const items = wishlistMemoryToggle(body.item ?? {});
    return NextResponse.json({ items });
  }
  if (action === "remove") {
    const sku = typeof body.sku === "string" ? body.sku : "";
    const items = wishlistMemoryRemoveSku(sku);
    return NextResponse.json({ items });
  }

  return NextResponse.json(
    { error: "Unknown action (use toggle | remove)" },
    { status: 400 },
  );
}
