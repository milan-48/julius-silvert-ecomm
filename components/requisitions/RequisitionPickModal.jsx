"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { toast } from "sonner";

/**
 * @typedef {{
 *   sku: string;
 *   slug: string;
 *   title: string;
 *   imageSrc?: string;
 *   purchaseSize: string;
 *   quantity?: number;
 *   unitPrice: number;
 *   unitLabel: string;
 *   sizeOptions?: { value: string; label: string }[] | null;
 *   priceBySize?: Record<string, { price: number; unitPrice: string }> | null;
 *   netWeight?: string;
 * }} RequisitionProductPayload
 */

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   product: RequisitionProductPayload;
 * }} props
 */
export function RequisitionPickModal({ open, onClose, product }) {
  const titleId = useId();
  const [mode, setMode] = useState("existing");
  const [lists, setLists] = useState(/** @type {object[]} */ ([]));
  const [listId, setListId] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const loadLists = useCallback(async () => {
    setFetching(true);
    try {
      const r = await fetch("/api/requisitions", { cache: "no-store" });
      const d = await r.json();
      if (r.ok && Array.isArray(d.lists)) {
        setLists(d.lists);
        setListId((prev) => {
          if (d.lists.length === 0) return "";
          const stillThere = d.lists.some((l) => l.id === prev);
          return stillThere ? prev : d.lists[0].id;
        });
        if (d.lists.length === 0) {
          setMode("new");
        }
      }
    } catch {
      toast.error("Could not load requisition lists");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setMode("existing");
    setListId("");
    setNewName("");
    setNewDescription("");
    void loadLists();
  }, [open, loadLists]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function submit() {
    setLoading(true);
    try {
      if (mode === "existing") {
        if (!listId) {
          toast.error("Select a list or create a new one");
          setLoading(false);
          return;
        }
        const r = await fetch("/api/requisitions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "addItem",
            listId,
            item: product,
          }),
          cache: "no-store",
        });
        const d = await r.json();
        if (!r.ok) {
          if (d.error === "invalid_item") {
            toast.error("Invalid product data");
          } else if (d.error === "list_not_found") {
            toast.error("List not found");
          } else {
            toast.error("Could not add item");
          }
          return;
        }
        const name = lists.find((l) => l.id === listId)?.name ?? "list";
        toast.success("Added to requisition list", {
          description: name,
        });
        onClose();
        return;
      }

      const name = newName.trim();
      if (!name) {
        toast.error("Enter a list name");
        setLoading(false);
        return;
      }
      const r = await fetch("/api/requisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          name,
          description: newDescription.trim(),
          item: product,
        }),
        cache: "no-store",
      });
      const d = await r.json();
      if (!r.ok) {
        if (d.error === "invalid_item") {
          toast.error("Invalid product data");
        } else if (d.error === "name_required") {
          toast.error("Name is required");
        } else {
          toast.error("Could not create list");
        }
        return;
      }
      toast.success("List created", { description: name });
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl"
            >
              Add to requisition list
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
              {product.title}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <div
            role="radiogroup"
            aria-label="Choose how to add"
            className="flex rounded-xl border border-neutral-200/90 bg-neutral-100 p-1"
          >
            <button
              type="button"
              role="radio"
              aria-checked={mode === "existing"}
              disabled={lists.length === 0}
              onClick={() => setMode("existing")}
              className={`min-h-11 flex-1 rounded-lg px-3 text-xs font-semibold uppercase tracking-wide transition-all sm:text-sm ${
                mode === "existing"
                  ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/80"
                  : "text-neutral-600 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
              }`}
            >
              Existing list
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "new"}
              onClick={() => setMode("new")}
              className={`min-h-11 flex-1 rounded-lg px-3 text-xs font-semibold uppercase tracking-wide transition-all sm:text-sm ${
                mode === "new"
                  ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200/80"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              New list
            </button>
          </div>

          {mode === "existing" ? (
            <div className="mt-5">
              <label
                htmlFor="req-list-select"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500"
              >
                Select list
              </label>
              {fetching ? (
                <div className="flex h-12 items-center rounded-xl border border-neutral-200/90 bg-neutral-50 px-4 text-sm text-neutral-500">
                  <span className="inline-block size-4 animate-pulse rounded bg-neutral-200" />
                  <span className="ml-3">Loading lists…</span>
                </div>
              ) : lists.length === 0 ? (
                <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 px-4 py-3 text-sm leading-relaxed text-neutral-600">
                  You don’t have any lists yet. Switch to{" "}
                  <strong className="font-semibold text-neutral-800">New list</strong>{" "}
                  to create one.
                </p>
              ) : (
                <div className="relative">
                  <select
                    id="req-list-select"
                    value={listId}
                    onChange={(e) => setListId(e.target.value)}
                    className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-neutral-200/90 bg-white py-0 pl-4 pr-12 text-sm font-semibold tracking-tight text-neutral-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] hover:border-neutral-300 hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)] focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/12 focus:ring-offset-0"
                  >
                    {lists.map((l) => {
                      const n = Array.isArray(l.items) ? l.items.length : 0;
                      return (
                        <option key={l.id} value={l.id}>
                          {l.name}
                          {n > 0 ? ` · ${n} ${n === 1 ? "item" : "items"}` : ""}
                        </option>
                      );
                    })}
                  </select>
                  <span
                    className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-500"
                    aria-hidden
                  >
                    <ChevronDown className="size-5 shrink-0" strokeWidth={2} />
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="req-new-name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500"
                >
                  List name
                </label>
                <input
                  id="req-new-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Weekly order guide"
                  className="h-12 w-full rounded-xl border border-neutral-200/90 bg-white px-4 text-sm font-medium text-neutral-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-neutral-400 transition-[border-color,box-shadow] hover:border-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/12"
                />
              </div>
              <div>
                <label
                  htmlFor="req-new-desc"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500"
                >
                  Description{" "}
                  <span className="font-normal normal-case tracking-normal text-neutral-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="req-new-desc"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Notes for your team or future you…"
                  className="w-full resize-y rounded-xl border border-neutral-200/90 bg-white px-4 py-3 text-sm text-neutral-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-neutral-400 transition-[border-color,box-shadow] hover:border-neutral-300 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/12"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-neutral-100 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
          <button
            type="button"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={
              loading ||
              (mode === "existing" && (!listId || lists.length === 0)) ||
              (mode === "new" && !newName.trim())
            }
            className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
            onClick={() => void submit()}
          >
            {loading
              ? "Saving…"
              : mode === "existing"
                ? "Add to list"
                : "Create & add"}
          </button>
        </div>
      </div>
    </div>
  );
}
