"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, UserRound, Menu } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { NAV_LINKS, SPECIAL_NAV_LINK } from "@/lib/constants";

/** Lucide 24px grid — sharp on retina; avoid odd sizes that blur strokes */
const ICON_PX = 24;
const ICON_STROKE = 1.75;
const LOGO_W = 319;
const LOGO_H = 58;

/**
 * Julius Silvert — white header, meat & specialty nav (our design, polished).
 * cartItemCount: badge only when count > 0.
 */
export function Header({
  mobileNavOpen,
  onMobileNavToggle,
  onMobileNavClose,
  cartItemCount = 0,
}) {
  return (
    <header className="bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="site-container">
        <div className="flex items-center justify-between gap-3 py-3.5 sm:gap-6 sm:py-4">
          <Link
            href="/"
            className="shrink-0 transition-opacity duration-200 hover:opacity-85"
            aria-label="Julius Silvert - Home"
          >
            <Image
              src="/juliusSilvertLogo.svg"
              alt="Julius Silvert"
              width={LOGO_W}
              height={LOGO_H}
              className="h-10 w-auto sm:h-[46px] sm:w-auto"
              priority
              unoptimized
            />
          </Link>

          <div className="hidden min-w-0 flex-1 sm:flex sm:items-center sm:justify-center sm:px-2 md:px-6">
            <div className="w-full max-w-[min(100%,23rem)] md:max-w-[min(100%,27rem)] lg:max-w-[min(100%,30rem)]">
              <SearchBar />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1">
            <Link
              href="#"
              className="icon-hit"
              aria-label="Wishlist"
            >
              <Heart
                size={ICON_PX}
                strokeWidth={ICON_STROKE}
                className="shrink-0"
                aria-hidden
              />
            </Link>
            <Link
              href="#"
              className="icon-hit"
              aria-label="Account"
            >
              <UserRound
                size={ICON_PX}
                strokeWidth={ICON_STROKE}
                className="shrink-0"
                aria-hidden
              />
            </Link>
            <Link
              href="#"
              className="icon-hit relative"
              aria-label={
                cartItemCount > 0
                  ? `Shopping cart, ${cartItemCount} items`
                  : "Shopping cart"
              }
            >
              <ShoppingCart
                size={ICON_PX}
                strokeWidth={ICON_STROKE}
                className="shrink-0"
                aria-hidden
              />
              {cartItemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E7000B] text-[11px] font-semibold tabular-nums text-white">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={onMobileNavToggle ?? (() => {})}
              className="icon-hit"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
            >
              <Menu
                size={ICON_PX}
                strokeWidth={ICON_STROKE}
                className="shrink-0"
                aria-hidden
              />
            </button>
          </div>
        </div>

        <div className="pb-3.5 sm:hidden">
          <SearchBar />
        </div>

        <nav className="nav-category" aria-label="Categories">
          <ul className="hidden flex-wrap items-center justify-center gap-x-6 gap-y-2.5 md:gap-x-7 xl:gap-x-9 lg:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label} className="shrink-0">
                <Link href={href} className="nav-link-premium">
                  {label}
                </Link>
              </li>
            ))}
            <li className="shrink-0">
              <Link
                href={SPECIAL_NAV_LINK.href}
                className="nav-link-premium nav-link-premium--accent"
              >
                {SPECIAL_NAV_LINK.label}
              </Link>
            </li>
          </ul>

          <div className="lg:hidden">
            {mobileNavOpen ? (
              <div className="flex flex-col gap-0.5 pb-3 pt-2">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={onMobileNavClose}
                    className="rounded-lg px-2 py-3 text-[14px] font-medium tracking-tight text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href={SPECIAL_NAV_LINK.href}
                  onClick={onMobileNavClose}
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
