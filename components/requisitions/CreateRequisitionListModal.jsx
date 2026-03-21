"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   onCreated?: (list: { id: string; name: string }) => void;
 * }} props
 */
export function CreateRequisitionListModal({ open, onClose, onCreated }) {
  const titleId = useId();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function submit() {
    const n = name.trim();
    if (!n) {
      toast.error("Enter a list name");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/requisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createEmpty",
          name: n,
          description: description.trim(),
        }),
        cache: "no-store",
      });
      const d = await r.json();
      if (!r.ok) {
        toast.error(d.error === "name_required" ? "Name is required" : "Could not create list");
        return;
      }
      toast.success("List created", { description: n });
      onCreated?.(d.list);
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
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6">
          <h2
            id={titleId}
            className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl"
          >
            New requisition list
          </h2>
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
        <div className="space-y-4 px-5 py-4 sm:px-6">
          <div>
            <label
              htmlFor="create-req-name"
              className="block text-sm font-medium text-neutral-800"
            >
              List name
            </label>
            <input
              id="create-req-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekly order guide"
              className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>
          <div>
            <label
              htmlFor="create-req-desc"
              className="block text-sm font-medium text-neutral-800"
            >
              Description{" "}
              <span className="font-normal text-neutral-500">(optional)</span>
            </label>
            <textarea
              id="create-req-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Notes for your team…"
              className="mt-2 w-full resize-y rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>
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
            disabled={loading || !name.trim()}
            className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
            onClick={() => void submit()}
          >
            {loading ? "Saving…" : "Create list"}
          </button>
        </div>
      </div>
    </div>
  );
}
