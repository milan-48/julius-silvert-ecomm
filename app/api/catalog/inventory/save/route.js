import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getProductBySlug } from "@/lib/memoryDb/queries";
import { applyStockPatch } from "@/lib/memoryDb/stockUtils";

/**
 * POST — batch save stock after verifying a 6-digit PIN.
 * PIN is checked with bcrypt against the hash below (plain PIN is not in source).
 * To rotate: `pnpm exec node scripts/hash-stock-pin.js 123456` and paste the new hash.
 *
 * Body: { pin: string, updates: Array<{ slug, stockCase?, stockPc?, stockSingle? }> }
 */

/** Bcrypt hash for the current stock-save PIN (6 digits). */
const STOCK_SAVE_PIN_BCRYPT =
  "$2b$12$ZYQ.TH5qBvKiDLV.84yNbOHFRL8a7s1HhtLoqYCIENkivrg13N8pG";

function isNonNegInt(n) {
  const x = Math.floor(Number(n));
  return Number.isFinite(x) && x >= 0;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const pin = typeof body?.pin === "string" ? body.pin.replace(/\s/g, "") : "";
  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json(
      { error: "PIN must be exactly 6 digits" },
      { status: 400 },
    );
  }

  const pinOk = await bcrypt.compare(pin, STOCK_SAVE_PIN_BCRYPT);
  if (!pinOk) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const updates = body?.updates;
  if (!Array.isArray(updates) || updates.length === 0) {
    return NextResponse.json(
      { error: "updates must be a non-empty array" },
      { status: 400 },
    );
  }

  const toApply = [];

  for (const u of updates) {
    const slug = typeof u?.slug === "string" ? u.slug.trim() : "";
    if (!slug) {
      return NextResponse.json({ error: "Each update needs a slug" }, { status: 400 });
    }

    const product = getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${slug}` }, { status: 400 });
    }

    const hasCasePc =
      Array.isArray(product.sizeOptions) && product.sizeOptions.length > 1;

    if (hasCasePc) {
      if (!isNonNegInt(u.stockCase) || !isNonNegInt(u.stockPc)) {
        return NextResponse.json(
          { error: `Invalid case/PC stock for ${slug}` },
          { status: 400 },
        );
      }
      toApply.push({
        product,
        patch: {
          stockCase: Math.floor(Number(u.stockCase)),
          stockPc: Math.floor(Number(u.stockPc)),
        },
      });
    } else {
      if (!isNonNegInt(u.stockSingle)) {
        return NextResponse.json(
          { error: `Invalid single stock for ${slug}` },
          { status: 400 },
        );
      }
      toApply.push({
        product,
        patch: { stockSingle: Math.floor(Number(u.stockSingle)) },
      });
    }
  }

  for (const { product, patch } of toApply) {
    applyStockPatch(product, patch);
  }

  return NextResponse.json({
    ok: true,
    saved: toApply.length,
  });
}
