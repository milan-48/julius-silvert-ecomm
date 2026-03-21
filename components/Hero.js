import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { HERO } from "@/lib/constants";

/**
 * Hero — background: /assets/herosection.png
 * Headline: Inter 700, 60px / 75px lh, tracking 0.26px, #FFF (Figma)
 * CTA: pill, 40px tall, white bg; label 14px / 500 / 20px lh, -0.15px tracking, #000 + chevron
 * Subheadline: Inter 400, 20px / 28px lh, -0.45px tracking, #E5E7EB (Figma)
 */
export function Hero() {
  return (
    <section
      className="relative flex min-h-[420px] items-center sm:min-h-[500px] md:min-h-[580px] lg:min-h-[640px]"
      aria-labelledby="hero-headline"
    >
      <div className="absolute inset-0 bg-[#0d1117]">
        <Image
          src="/assets/herosection.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          style={{ objectPosition: "center center" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/60"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <h1
            id="hero-headline"
            className="mb-5 text-[clamp(2.25rem,4.5vw+0.5rem,3.75rem)] font-bold leading-[1.25] tracking-[0.26px] text-white lg:text-[60px] lg:leading-[75px]"
          >
            {HERO.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mb-8 max-w-[328px] text-[20px] font-normal leading-7 tracking-[-0.45px] text-[#E5E7EB] sm:mb-10">
            {HERO.subheadline}
          </p>
          <Link
            href={HERO.ctaHref}
            className="inline-flex h-10 max-w-full items-center justify-center gap-3 rounded-full bg-white px-8 text-sm font-medium leading-5 tracking-[-0.15px] text-black transition-colors hover:bg-neutral-100 sm:px-10"
          >
            <span className="text-center">{HERO.ctaText}</span>
            <ChevronRight
              className="size-[18px] shrink-0 text-black"
              strokeWidth={2.25}
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
