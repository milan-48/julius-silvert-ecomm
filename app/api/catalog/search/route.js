import { NextResponse } from "next/server";
import { searchCatalog } from "@/lib/memoryDb/queries";

export const dynamic = "force-dynamic";

const MAX_QUERY_LEN = 200;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("q") ?? "";
  if (raw.length > MAX_QUERY_LEN) {
    return NextResponse.json(
      { error: "query_too_long", max: MAX_QUERY_LEN },
      { status: 400 },
    );
  }

  const result = searchCatalog(raw);
  return NextResponse.json(result);
}
