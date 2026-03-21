import { NextResponse } from "next/server";
import { getRequisitionListById } from "@/lib/memoryDb/requisitionMemoryStore";

export const dynamic = "force-dynamic";

export async function GET(_request, context) {
  const { id } = await context.params;
  const list = getRequisitionListById(String(id ?? ""));
  if (!list) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ list });
}
