import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { HERO } from "@/lib/constants";

export function Hero() {
  return (
    <section
      className="relative min-h-[420px] sm:min-h-[500px] md:min-h-[580px] lg:min-h-[640px] flex items-center"
      aria-labelledby="hero-headline"
    >
      {/* Background Image with dark overlay - bg ensures dark base if image loads slowly */}
      <div className="absolute inset-0 bg-[#0d1117]">
        <Image
          src="/hero-artichokes.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          style={{ objectPosition: "center center" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/55"
          aria-hidden
        />
      </div>

      {/* Content - generous padding to match Figma */}
      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <h1
            id="hero-headline"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5rem] font-extrabold text-white leading-[1.05] tracking-tight mb-5"
          >
            {HERO.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white font-normal mb-10">
            {HERO.subheadline}
          </p>
          <Link
            href={HERO.ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[#000000] font-bold text-base hover:bg-slate-50 transition-colors"
          >
            {HERO.ctaText}
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
