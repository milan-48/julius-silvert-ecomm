"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/lib/icons";
import { HOME_HERO_SLIDES } from "@/lib/constants";

const AUTO_MS = 5000;

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

/**
 * Hero carousel — full-bleed image per slide + gradient + copy.
 * Auto-advances; pagination overlaid inside the hero (pause on hover; reduced motion).
 */
export function Hero() {
  const slides = HOME_HERO_SLIDES;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion || paused || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, slides.length]);

  const goTo = useCallback(
    (idx) => {
      setActive(((idx % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  return (
    <section
      className="relative max-w-full overflow-x-hidden bg-[#0d1117]"
      aria-roledescription="carousel"
      aria-label="Homepage hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex min-h-[420px] w-full items-center sm:min-h-[500px] md:min-h-[580px] lg:min-h-[640px]">
        {slides.map((slide, idx) => {
          const src = slide.imageSrc;
          if (!src) return null;

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${slides.length}`}
              aria-hidden={idx !== active}
              className={`absolute inset-0 flex items-center transition-opacity duration-700 ease-in-out ${
                idx === active
                  ? "z-10 opacity-100"
                  : "z-0 opacity-0 pointer-events-none"
              }`}
            >
              <div className="absolute inset-0 bg-[#0d1117]">
                <Image
                  src={src}
                  alt={slide.imageAlt || ""}
                  fill
                  priority={idx === 0}
                  quality={88}
                  className="object-cover"
                  sizes="100vw"
                  style={{
                    objectPosition:
                      slide.imageObjectPosition ?? "center center",
                  }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/60"
                  aria-hidden
                />
              </div>

              <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
                <div className="max-w-2xl">
                  <h1
                    id={idx === active ? "hero-headline" : undefined}
                    className="mb-5 text-[clamp(2.25rem,4.5vw+0.5rem,3.75rem)] font-bold leading-[1.25] tracking-[0.26px] text-white lg:text-[60px] lg:leading-[75px]"
                  >
                    {slide.headlineLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="mb-8 max-w-[328px] text-[20px] font-normal leading-7 tracking-[-0.45px] text-[#E5E7EB] sm:mb-10">
                    {slide.subheadline}
                  </p>
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex h-10 max-w-full items-center justify-center gap-3 rounded-full bg-white px-8 text-sm font-medium leading-5 tracking-[-0.15px] text-black transition-colors hover:bg-neutral-100 sm:px-10"
                  >
                    <span className="text-center">{slide.ctaText}</span>
                    <ChevronRightIcon color="#000000" width={18} height={18} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {slides.length > 1 ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-[max(3.5rem,calc(1rem+env(safe-area-inset-bottom,0px)))] z-30 flex justify-center px-4 sm:bottom-20 md:bottom-24 lg:bottom-28"
            role="tablist"
            aria-label="Hero slides"
          >
            <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/20 bg-black/45 px-3 py-2.5 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-black/35">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === active}
                  aria-label={`Show slide ${idx + 1}: ${slide.headlineLines.join(" ")}`}
                  className={`box-border shrink-0 rounded-full border-2 border-white/80 bg-transparent transition-[width,border-color,background-color] duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
                    idx === active
                      ? "h-2.5 w-10 border-white bg-white/20"
                      : "size-2.5 hover:border-white hover:bg-white/15"
                  }`}
                  onClick={() => goTo(idx)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
