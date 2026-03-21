"use client";

import { CircleCheck } from "lucide-react";
import { Toaster } from "sonner";

/**
 * Sonner host — custom styling via `globals.css` (`.js-site-toaster`).
 * Top-right, below header; neutral card + brand accent (no mint “rich” success theme).
 * @see https://sonner.emilkowal.ski/
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      theme="light"
      richColors={false}
      closeButton
      duration={4400}
      visibleToasts={3}
      expand={false}
      gap={12}
      className="js-site-toaster"
      offset={{ top: "5.25rem", right: "max(1rem, env(safe-area-inset-right))" }}
      mobileOffset={{
        top: "4.5rem",
        right: "max(0.75rem, env(safe-area-inset-right))",
      }}
      icons={{
        success: (
          <CircleCheck
            className="size-[22px] shrink-0"
            strokeWidth={1.85}
            aria-hidden
          />
        ),
      }}
    />
  );
}
