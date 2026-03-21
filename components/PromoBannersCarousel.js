"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/lib/icons";
import { HOME_PROMO_BANNERS } from "@/lib/constants";

const AUTO_MS = 8000;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function PromoSlide({ p, active, index }) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${HOME_PROMO_BANNERS.length}`}
      aria-hidden={!active}
      className={`transition-opacity duration-700 ease-in-out ${
        active
          ? "relative z-10 opacity-100"
          : "absolute inset-0 z-0 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="overflow-hidden rounded-2xl lg:rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.12)]"
        style={{
          background:
            "radial-gradient(ellipse 85% 100% at 0% 45%, rgba(255,255,255,0.07) 0%, transparent 55%), #101820",
        }}
      >
        <div className="grid items-center gap-10 p-8 md:gap-12 md:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
          <div className="flex min-w-0 flex-col gap-5 md:gap-6">
            <p className="w-fit rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              {p.badge}
            </p>
            <h2
              id={active ? "promo-banners-heading" : undefined}
              className="text-[clamp(2rem,4vw+0.5rem,3.25rem)] font-bold uppercase leading-[1.08] tracking-tight text-white"
            >
              {p.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-lg font-medium leading-snug text-neutral-300 md:text-xl">
              {p.subtitle}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">
              {p.description}
            </p>
            <Link
              href={p.ctaHref}
              className="mt-1 inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#101820]"
            >
              {p.ctaLabel}
              <ChevronRightIcon color="currentColor" width={18} height={18} />
            </Link>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl bg-black/20 shadow-inner shadow-black/20 lg:rounded-3xl">
            <div className="relative aspect-[4/3] w-full sm:aspect-[5/4]">
              <Image
                src={p.imageSrc}
                alt={p.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Auto-rotating two-column promos — `HOME_PROMO_BANNERS`.
 */
export function PromoBannersCarousel() {
  const banners = HOME_PROMO_BANNERS;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion || paused || banners.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % banners.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, banners.length]);

  const goTo = useCallback(
    (idx) => {
      setActive(((idx % banners.length) + banners.length) % banners.length);
    },
    [banners.length],
  );

  return (
    <section
      className="bg-white pt-4 pb-10 sm:pt-6 sm:pb-14 lg:pt-8 lg:pb-16"
      aria-labelledby="promo-banners-heading"
      aria-roledescription="carousel"
      aria-label="Featured programs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[min(100vw,520px)] sm:min-h-[480px] lg:min-h-[420px]">
          {banners.map((p, idx) => (
            <PromoSlide
              key={p.id}
              p={p}
              active={idx === active}
              index={idx}
            />
          ))}
        </div>

        {banners.length > 1 ? (
          <div
            className="mt-6 flex justify-center gap-2"
            role="tablist"
            aria-label="Promo slides"
          >
            {banners.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={idx === active}
                aria-label={`Show promo ${idx + 1}: ${p.titleLines.join(" ")}`}
                className={`h-2 rounded-full transition-[width,background-color] duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                  idx === active
                    ? "w-8 bg-neutral-800"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
                onClick={() => goTo(idx)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
