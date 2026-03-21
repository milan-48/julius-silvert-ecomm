"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks `pending` but keeps output `true` for at least `minMs` after each
 * transition into the pending state (so fast updates still show loading UI).
 */
export function useMinimumPending(pending, minMs = 240) {
  const [display, setDisplay] = useState(false);
  const startRef = useRef(0);
  const timeoutRef = useRef(null);
  const armedRef = useRef(false);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (pending) {
      armedRef.current = true;
      startRef.current = Date.now();
      setDisplay(true);
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }

    if (!armedRef.current) {
      return;
    }

    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, minMs - elapsed);
    timeoutRef.current = setTimeout(() => {
      setDisplay(false);
      armedRef.current = false;
      timeoutRef.current = null;
    }, remaining);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [pending, minMs]);

  return display;
}
