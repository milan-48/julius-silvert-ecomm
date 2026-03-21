import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/memoryDb/queries";
import { deductStock } from "@/lib/memoryDb/stockUtils";

/**
 * POST { items: { slug, sku, purchaseSize, quantity }[] }
 * Validates stock, deducts from in-memory catalog, does not persist an order.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const items = body?.items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "items must be a non-empty array" },
      { status: 400 },
    );
  }

  if (items.length > 80) {
    return NextResponse.json({ error: "Too many lines" }, { status: 400 });
  }

  const normalized = [];
  for (const row of items) {
    const slug = typeof row?.slug === "string" ? row.slug.trim() : "";
    const sku = typeof row?.sku === "string" ? row.sku.trim() : "";
    const purchaseSize =
      typeof row?.purchaseSize === "string" ? row.purchaseSize.trim() : "";
    const quantity = Math.floor(Number(row?.quantity));
    if (!slug || !sku || !purchaseSize || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: "Invalid line: slug, sku, purchaseSize, quantity (1–99)" },
        { status: 400 },
      );
    }
    normalized.push({ slug, sku, purchaseSize, quantity });
  }

  const resolved = [];
  for (const line of normalized) {
    const product = getProductBySlug(line.slug);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found", slug: line.slug },
        { status: 400 },
      );
    }
    if (product.sku !== line.sku) {
      return NextResponse.json(
        { error: "SKU mismatch", slug: line.slug },
        { status: 400 },
      );
    }
    resolved.push({ product, ...line });
  }

  /** Dry-run on shallow clones so we never partially deduct */
  for (const { product, purchaseSize, quantity, slug } of resolved) {
    const probe = {
      ...product,
      stockCase: product.stockCase,
      stockPc: product.stockPc,
      stockSingle: product.stockSingle,
      sizeOptions: product.sizeOptions,
    };
    const r = deductStock(probe, purchaseSize, quantity);
    if (!r.ok) {
      return NextResponse.json(
        {
          error: r.code ?? "checkout_failed",
          message: r.message,
          slug,
          purchaseSize,
        },
        { status: 409 },
      );
    }
  }

  for (const { product, purchaseSize, quantity } of resolved) {
    const r = deductStock(product, purchaseSize, quantity);
    if (!r.ok) {
      return NextResponse.json(
        { error: "Stock changed during checkout", code: r.code },
        { status: 409 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    deducted: resolved.map((r) => ({
      slug: r.slug,
      sku: r.sku,
      purchaseSize: r.purchaseSize,
      quantity: r.quantity,
    })),
  });
}
