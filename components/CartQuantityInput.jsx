"use client";

import { useEffect, useState } from "react";
import { setCartLineQuantity } from "@/lib/store/cartSlice";
import { useAppDispatch } from "@/lib/store/hooks";

/**
 * Editable qty in the +/- pill. Middle was a plain span — users expect to type a number.
 */
export function CartQuantityInput({
  lineId,
  quantity,
  className = "",
  onClick,
  /** When true, quantity cannot be typed up (e.g. shelf is 0 — use − only). */
  readOnly = false,
}) {
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState(() => String(quantity));

  useEffect(() => {
    setDraft(String(quantity));
  }, [quantity, lineId]);

  function commit() {
    if (readOnly) return;
    const raw = draft.trim();
    const n = parseInt(raw, 10);
    const q =
      raw === "" || Number.isNaN(n) ? 1 : Math.max(1, Math.min(99, n));
    dispatch(setCartLineQuantity({ lineId, quantity: q }));
    setDraft(String(q));
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      aria-label="Quantity"
      readOnly={readOnly}
      className={`${className}${readOnly ? " cursor-default" : ""}`.trim()}
      value={draft}
      onChange={(e) => {
        if (readOnly) return;
        const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
        setDraft(digits);
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
          e.currentTarget.blur();
        }
      }}
      onClick={(e) => {
        onClick?.(e);
        e.stopPropagation();
      }}
    />
  );
}
