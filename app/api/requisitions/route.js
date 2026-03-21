import { NextResponse } from "next/server";
import {
  getRequisitionListsSnapshot,
  requisitionAddItem,
  requisitionCreateEmpty,
  requisitionCreateWithItem,
  requisitionDeleteList,
  requisitionRemoveLine,
  requisitionSetLineQuantity,
} from "@/lib/memoryDb/requisitionMemoryStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ lists: getRequisitionListsSnapshot() });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body?.action;

  if (action === "create") {
    const result = requisitionCreateWithItem(
      body.name,
      body.description,
      body.item ?? {},
    );
    if (!result.ok) {
      const status = result.code === "name_required" ? 400 : 400;
      return NextResponse.json(
        { error: result.code, lists: result.lists },
        { status },
      );
    }
    return NextResponse.json({
      lists: result.lists,
      list: result.list,
    });
  }

  if (action === "createEmpty") {
    const result = requisitionCreateEmpty(body.name, body.description);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.code, lists: result.lists },
        { status: 400 },
      );
    }
    return NextResponse.json({
      lists: result.lists,
      list: result.list,
    });
  }

  if (action === "addItem") {
    const result = requisitionAddItem(body.listId, body.item ?? {});
    if (!result.ok) {
      return NextResponse.json(
        { error: result.code, lists: result.lists },
        { status: result.code === "list_not_found" ? 404 : 400 },
      );
    }
    return NextResponse.json({ lists: result.lists });
  }

  if (action === "removeItem") {
    const result = requisitionRemoveLine(
      body.listId,
      body.sku,
      body.purchaseSize,
    );
    return NextResponse.json({ lists: result.lists, ok: result.ok });
  }

  if (action === "setItemQty") {
    const result = requisitionSetLineQuantity(
      body.listId,
      body.sku,
      body.purchaseSize,
      body.quantity,
    );
    if (!result.ok) {
      const status = result.code === "list_not_found" ? 404 : 400;
      return NextResponse.json({ error: result.code, lists: result.lists }, { status });
    }
    return NextResponse.json({ lists: result.lists, ok: true });
  }

  if (action === "deleteList") {
    const result = requisitionDeleteList(body.listId);
    if (!result.ok) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ lists: result.lists });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
