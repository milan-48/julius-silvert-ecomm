"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";

/**
 * App-styled confirmation dialog (replaces window.confirm).
 *
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   title: string;
 *   description?: string;
 *   confirmLabel?: string;
 *   cancelLabel?: string;
 *   variant?: "danger" | "neutral";
 *   loading?: boolean;
 *   onConfirm: () => void | Promise<void>;
 * }} props
 */
export function ConfirmModal({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  onConfirm,
}) {
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, loading]);

  if (!open) return null;

  const confirmClass =
    variant === "danger"
      ? "rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
      : "rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300";

  return (
    <div
      className="fixed inset-0 z-[260] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Close"
        disabled={loading}
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6">
          <h2
            id={titleId}
            className="pr-2 text-lg font-bold tracking-tight text-neutral-900 sm:text-xl"
          >
            {title}
          </h2>
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-800 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Close"
            disabled={loading}
            onClick={onClose}
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>
        {description ? (
          <p
            id={descId}
            className="px-5 py-4 text-sm leading-relaxed text-neutral-600 sm:px-6"
          >
            {description}
          </p>
        ) : null}
        <div className="flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
          <button
            type="button"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmClass}
            disabled={loading}
            onClick={() => void onConfirm()}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
