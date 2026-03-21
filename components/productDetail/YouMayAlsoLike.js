"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { softPlaceholderBg } from "@/lib/softPlaceholderColor";

function formatUsd(value) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * @param {{ slug: string; imageSrc: string; imageAlt: string; title: string; price: number; unitPrice: string }} props
 */
function YouMayAlsoLikeCard({ product: p }) {
  const [failed, setFailed] = useState(false);
  const placeholderBg = useMemo(() => softPlaceholderBg(p.slug), [p.slug]);
  const href = `/${p.slug}`;
  const showImg = Boolean(p.imageSrc) && !failed;

  return (
    <article className="min-w-0">
      <Link
        href={href}
        className="group block rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <div
          className="relative h-24 w-full overflow-hidden rounded-[8px] bg-neutral-100 ring-1 ring-neutral-200/90 transition-shadow group-hover:ring-2 group-hover:ring-blue-500 sm:h-28 lg:h-32"
        >
          {!showImg ? (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: placeholderBg }}
              aria-hidden
            />
          ) : null}
          {showImg ? (
            <Image
              src={p.imageSrc}
              alt={p.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 180px"
              onError={() => setFailed(true)}
            />
          ) : null}
        </div>
        <h3 className="mt-3 text-left text-sm font-medium leading-5 tracking-[-0.15px] text-[#0A0A0A]">
          {p.title}
        </h3>
        <p className="mt-1 text-left text-sm font-bold leading-5 tracking-[-0.15px] text-[#0A0A0A]">
          {formatUsd(p.price)} {p.unitPrice}
        </p>
      </Link>
    </article>
  );
}

/**
 * @param {{ items: Array<{ slug: string; imageSrc: string; imageAlt: string; title: string; price: number; unitPrice: string }> }} props
 */
export function YouMayAlsoLike({ items }) {
  if (!items?.length) return null;

  return (
    <section
      className="mt-14 border-t border-[#EAECF0] pt-10 sm:mt-16 sm:pt-12"
      aria-labelledby="you-may-also-like-heading"
    >
      <h2
        id="you-may-also-like-heading"
        className="text-left text-[24px] font-bold leading-[32px] tracking-[0.07px] text-[#0A0A0A]"
      >
        You May Also Like
      </h2>
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {items.map((p) => (
          <li key={p.slug} className="min-w-0">
            <YouMayAlsoLikeCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
