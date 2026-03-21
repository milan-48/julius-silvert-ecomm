"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, UserRound, Menu, ChevronDown } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { NavMegaMenuPanel } from "./NavMegaMenuPanel";
import { NAV_LINKS, SPECIAL_NAV_LINK } from "@/lib/constants";
import { openCartDrawer, selectCartCount } from "@/lib/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

/** Header utility icons: 20px mobile, 24px sm+ (Lucide grid stays sharp). */
const ICON_STROKE = 1.75;
const LOGO_W = 319;
const LOGO_H = 58;

const MEGA_LEAVE_MS = 140;

/**
 * White header + category row (our theme). Drawer *content* from your screenshots lives in constants.
 */
export function Header({
  mobileNavOpen,
  onMobileNavToggle,
  onMobileNavClose,
}) {
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartCount);
  const [desktopMegaId, setDesktopMegaId] = useState(null);
  const [mobileMegaId, setMobileMegaId] = useState(null);
  const leaveTimerRef = useRef(null);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current != null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const scheduleCloseMega = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = window.setTimeout(() => {
      setDesktopMegaId(null);
      leaveTimerRef.current = null;
    }, MEGA_LEAVE_MS);
  }, [clearLeaveTimer]);

  useEffect(() => {
    return () => clearLeaveTimer();
  }, [clearLeaveTimer]);

  useEffect(() => {
    if (!mobileNavOpen) setMobileMegaId(null);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!desktopMegaId) return;
    const onKey = (e) => {
      if (e.key === "Escape") setDesktopMegaId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [desktopMegaId]);

  const activeMegaItem = NAV_LINKS.find(
    (n) => n.id === desktopMegaId && n.megaMenu,
  );

  const closeMobileNav = onMobileNavClose ?? (() => {});

  return (
    <header className="sticky top-0 z-50 max-w-full bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="site-container max-w-full">
        <div className="flex min-w-0 items-center justify-between gap-2 py-3 sm:gap-6 sm:py-4">
          <Link
            href="/"
            className="flex min-w-0 shrink items-center leading-none transition-opacity duration-200 hover:opacity-85"
            aria-label="Julius Silvert - Home"
          >
            <Image
              src="/juliusSilvertLogo.svg"
              alt="Julius Silvert"
              width={LOGO_W}
              height={LOGO_H}
              className="block h-9 w-auto max-w-[min(124px,36vw)] object-contain object-left sm:h-[46px] sm:max-w-none sm:w-auto"
              priority
              unoptimized
            />
          </Link>

          <div className="hidden min-w-0 flex-1 sm:flex sm:items-center sm:justify-center sm:px-2 md:px-6">
            <div className="w-full max-w-[min(100%,23rem)] md:max-w-[min(100%,27rem)] lg:max-w-[min(100%,30rem)]">
              <SearchBar />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-0 sm:gap-1">
            <Link href="#" className="icon-hit" aria-label="Wishlist">
              <Heart
                strokeWidth={ICON_STROKE}
                className="size-5 shrink-0 sm:size-6"
                aria-hidden
              />
            </Link>
            <Link href="#" className="icon-hit" aria-label="Account">
              <UserRound
                strokeWidth={ICON_STROKE}
                className="size-5 shrink-0 sm:size-6"
                aria-hidden
              />
            </Link>
            <button
              type="button"
              className="icon-hit relative border-0 bg-transparent p-0"
              aria-label={
                cartItemCount > 0
                  ? `Shopping cart, ${cartItemCount} items`
                  : "Shopping cart"
              }
              onClick={() => dispatch(openCartDrawer())}
            >
              <ShoppingCart
                strokeWidth={ICON_STROKE}
                className="size-5 shrink-0 sm:size-6"
                aria-hidden
              />
              {cartItemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E7000B] text-[11px] font-semibold tabular-nums text-white">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={onMobileNavToggle ?? (() => {})}
              className="icon-hit"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
            >
              <Menu
                strokeWidth={ICON_STROKE}
                className="size-5 shrink-0 sm:size-6"
                aria-hidden
              />
            </button>
          </div>
        </div>

        <div className="min-w-0 pb-3 sm:hidden">
          <SearchBar className="min-w-0" />
        </div>

        <nav
          className="nav-category relative"
          aria-label="Categories"
          onMouseEnter={clearLeaveTimer}
          onMouseLeave={scheduleCloseMega}
        >
          <ul className="hidden flex-wrap items-center justify-center gap-x-4 gap-y-2.5 sm:gap-x-5 md:gap-x-6 xl:gap-x-8 lg:flex">
            {NAV_LINKS.map((item) => (
              <li
                key={item.id}
                className="shrink-0"
                onMouseEnter={() => {
                  clearLeaveTimer();
                  setDesktopMegaId(item.megaMenu ? item.id : null);
                }}
              >
                <Link
                  href={item.href}
                  className={`nav-link-premium inline-flex items-center gap-1 ${
                    item.megaMenu && desktopMegaId === item.id
                      ? "nav-link-premium--mega-active"
                      : ""
                  }`}
                  aria-expanded={
                    item.megaMenu ? desktopMegaId === item.id : undefined
                  }
                  aria-haspopup={item.megaMenu ? "true" : undefined}
                  aria-controls={
                    item.megaMenu && desktopMegaId === item.id
                      ? `mega-panel-${item.id}`
                      : undefined
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li
              className="shrink-0"
              onMouseEnter={() => {
                clearLeaveTimer();
                setDesktopMegaId(null);
              }}
            >
              <Link
                href={SPECIAL_NAV_LINK.href}
                className="nav-link-premium nav-link-premium--accent"
              >
                {SPECIAL_NAV_LINK.label}
              </Link>
            </li>
          </ul>

          {activeMegaItem?.megaMenu ? (
            <div
              id={`mega-panel-${activeMegaItem.id}`}
              className="absolute left-0 right-0 top-full z-50 hidden pt-1.5 lg:block"
              onMouseEnter={clearLeaveTimer}
              onMouseLeave={scheduleCloseMega}
              role="region"
              aria-label={`${activeMegaItem.label} submenu`}
            >
              <div className="mega-panel-shell mega-panel-animate rounded-b-2xl border-x border-b border-neutral-200/55">
                <div className="relative px-5 py-5 sm:px-7 sm:py-6 lg:px-9 lg:py-7">
                  <NavMegaMenuPanel
                    megaMenu={activeMegaItem.megaMenu}
                    variant="desktop"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="lg:hidden">
            {mobileNavOpen ? (
              <div className="flex flex-col gap-0.5 pb-3 pt-2">
                {NAV_LINKS.map((item) =>
                  item.megaMenu ? (
                    <div key={item.id} className="rounded-lg">
                      <div className="flex items-stretch gap-1">
                        <Link
                          href={item.href}
                          onClick={closeMobileNav}
                          className="min-w-0 flex-1 rounded-lg px-2 py-3 text-left text-[14px] font-medium tracking-tight text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          className="flex w-11 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
                          aria-expanded={mobileMegaId === item.id}
                          aria-controls={`mobile-mega-${item.id}`}
                          onClick={() =>
                            setMobileMegaId((m) =>
                              m === item.id ? null : item.id,
                            )
                          }
                        >
                          <ChevronDown
                            className={`size-5 transition-transform duration-200 ${
                              mobileMegaId === item.id ? "rotate-180" : ""
                            }`}
                            strokeWidth={2}
                            aria-hidden
                          />
                        </button>
                      </div>
                      {mobileMegaId === item.id ? (
                        <div
                          id={`mobile-mega-${item.id}`}
                          className="mx-1 mb-2 ml-2 rounded-xl border border-neutral-200/70 bg-gradient-to-b from-neutral-50/90 to-white py-4 pl-4 pr-3 shadow-inner shadow-neutral-900/[0.03]"
                        >
                          <NavMegaMenuPanel
                            megaMenu={item.megaMenu}
                            variant="mobile"
                            onNavigate={closeMobileNav}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={closeMobileNav}
                      className="block rounded-lg px-2 py-3 text-[14px] font-medium tracking-tight text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
                <Link
                  href={SPECIAL_NAV_LINK.href}
                  onClick={closeMobileNav}
                  className="rounded-lg px-2 py-3 text-[14px] font-semibold tracking-tight text-[#E7000B] hover:text-[#c40009]"
                >
                  {SPECIAL_NAV_LINK.label}
                </Link>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
