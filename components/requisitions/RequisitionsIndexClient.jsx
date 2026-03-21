"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";
import { CreateRequisitionListModal } from "./CreateRequisitionListModal";

function formatActivity(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function RequisitionsIndexClient() {
  const router = useRouter();
  const [lists, setLists] = useState(/** @type {object[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(/** @type {string | null} */ (null));

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/requisitions", { cache: "no-store" });
      const d = await r.json();
      if (r.ok && Array.isArray(d.lists)) {
        setLists(d.lists);
      } else {
        toast.error("Could not load lists");
      }
    } catch {
      toast.error("Could not load lists");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!menuOpenId) return;
    const onPointerDown = (e) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      const wrap = document.querySelector(`[data-req-menu-root="${menuOpenId}"]`);
      if (wrap?.contains(t)) return;
      setMenuOpenId(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpenId]);

  async function deleteList(id, name) {
    setMenuOpenId(null);
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    try {
      const r = await fetch("/api/requisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteList", listId: id }),
        cache: "no-store",
      });
      const d = await r.json();
      if (!r.ok) {
        toast.error("Could not delete list");
        return;
      }
      setLists(d.lists ?? []);
      toast.success("List deleted");
    } catch {
      toast.error("Could not delete list");
    }
  }

  return (
    <>
      <div className="site-container py-10 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              Requisition lists
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
              Save products into named lists for ordering later. Lists are stored for this
              session (until the server restarts).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden />
            Create new list
          </button>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          {loading ? (
            <p className="px-6 py-12 text-center text-sm text-neutral-500">
              Loading lists…
            </p>
          ) : lists.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm font-medium text-neutral-800">
                No requisition lists yet
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Create one from here, or add products from a product card or detail page.
              </p>
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Create your first list
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80">
                    <th className="px-5 py-3.5 font-semibold text-neutral-800 sm:px-6">
                      Name &amp; description
                    </th>
                    <th className="hidden px-4 py-3.5 font-semibold text-neutral-800 sm:table-cell">
                      Items
                    </th>
                    <th className="hidden px-4 py-3.5 font-semibold text-neutral-800 md:table-cell">
                      Latest activity
                    </th>
                    <th className="w-14 px-4 py-3.5 sm:w-16" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {lists.map((list) => {
                    const count = Array.isArray(list.items) ? list.items.length : 0;
                    const desc = String(list.description ?? "").trim();
                    return (
                      <tr
                        key={list.id}
                        className="transition-colors hover:bg-neutral-50/60"
                      >
                        <td className="px-5 py-4 sm:px-6">
                          <Link
                            href={`/requisitions/${list.id}`}
                            className="block font-semibold text-neutral-900 underline-offset-2 hover:underline"
                          >
                            {list.name}
                          </Link>
                          {desc ? (
                            <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
                              {desc}
                            </p>
                          ) : (
                            <p className="mt-0.5 text-xs text-neutral-400">—</p>
                          )}
                          <p className="mt-2 text-xs text-neutral-500 sm:hidden">
                            {count} item{count === 1 ? "" : "s"} ·{" "}
                            {formatActivity(list.updatedAt)}
                          </p>
                        </td>
                        <td className="hidden tabular-nums text-neutral-700 sm:table-cell sm:px-4 sm:py-4">
                          {count}
                        </td>
                        <td className="hidden text-neutral-600 md:table-cell md:px-4 md:py-4">
                          {formatActivity(list.updatedAt)}
                        </td>
                        <td
                          className="relative px-2 py-4 text-right sm:px-4"
                          data-req-menu-root={list.id}
                        >
                          <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
                            aria-label={`Actions for ${list.name}`}
                            aria-expanded={menuOpenId === list.id}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setMenuOpenId((id) => (id === list.id ? null : list.id));
                            }}
                          >
                            <MoreHorizontal className="size-5" strokeWidth={2} aria-hidden />
                          </button>
                          {menuOpenId === list.id ? (
                            <div
                              role="menu"
                              className="absolute right-2 top-full z-20 mt-1 min-w-[10rem] rounded-xl border border-neutral-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                role="menuitem"
                                className="block w-full px-4 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                                onClick={() => {
                                  setMenuOpenId(null);
                                  router.push(`/requisitions/${list.id}`);
                                }}
                              >
                                Open
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                className="block w-full px-4 py-2.5 text-left text-sm text-rose-700 hover:bg-rose-50"
                                onClick={() => void deleteList(list.id, list.name)}
                              >
                                Delete
                              </button>
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-neutral-500 sm:text-left">
          <Link
            href="/"
            className="font-medium text-[#E7000B] underline-offset-4 hover:underline"
          >
            Continue shopping
          </Link>
        </p>
      </div>

      <CreateRequisitionListModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => void refresh()}
      />
    </>
  );
}
