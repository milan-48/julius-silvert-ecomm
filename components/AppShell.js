"use client";

import { useState } from "react";
import { AppToaster } from "./AppToaster";
import { CartDrawer } from "./CartDrawer";
import { CartPersistence } from "./CartPersistence";
import { WishlistPersistence } from "./WishlistPersistence";
import { CatalogHydrator } from "./CatalogHydrator";
import { Header } from "./Header";
import { SiteFooter } from "./SiteFooter";

/**
 * Global chrome: sticky header, scrollable main, footer pinned to bottom on short pages.
 */
export function AppShell({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-[100dvh] min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white">
      <CatalogHydrator />
      <CartPersistence />
      <WishlistPersistence />
      <Header
        mobileNavOpen={mobileNavOpen}
        onMobileNavToggle={() => setMobileNavOpen((o) => !o)}
        onMobileNavClose={() => setMobileNavOpen(false)}
      />
      <main className="flex w-full min-w-0 flex-1 flex-col">{children}</main>
      <CartDrawer />
      <AppToaster />
      <SiteFooter />
    </div>
  );
}
