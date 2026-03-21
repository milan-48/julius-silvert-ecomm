import { NextResponse } from "next/server";
import { getProductBySlug, listAllProducts } from "@/lib/memoryDb/queries";
import {
  applyStockPatch,
  publicStockFields,
  withStockView,
} from "@/lib/memoryDb/stockUtils";

/**
 * GET — list all SKUs with live stock (for dev / ops tooling).
 * PATCH — set absolute stockCase / stockPc / stockSingle for a slug (partial update).
 */

export async function GET() {
  const products = listAllProducts().map((p) => ({
    slug: p.slug,
    sku: p.sku,
    title: p.title,
    categorySlug: p.categorySlug,
    stockCase: p.stockCase ?? 0,
    stockPc: p.stockPc ?? 0,
    stockSingle: p.stockSingle ?? 0,
    hasCasePc: Array.isArray(p.sizeOptions) && p.sizeOptions.length > 1,
    ...publicStockFields(p),
  }));
  return NextResponse.json({ products });
}

export async function PATCH(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const product = getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ok = applyStockPatch(product, {
    stockCase: body.stockCase,
    stockPc: body.stockPc,
    stockSingle: body.stockSingle,
  });

  if (!ok) {
    return NextResponse.json(
      {
        error:
          "Provide at least one of stockCase, stockPc, stockSingle (non-negative integers)",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    product: {
      slug: product.slug,
      sku: product.sku,
      stockCase: product.stockCase ?? 0,
      stockPc: product.stockPc ?? 0,
      stockSingle: product.stockSingle ?? 0,
      ...withStockView(product),
    },
  });
}
