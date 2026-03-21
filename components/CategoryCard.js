import Link from "next/link";
import {
  Beef,
  Droplet,
  Fish,
  LayoutGrid,
  LeafyGreen,
  Milk,
  Package,
  ShoppingBasket,
  Snowflake,
  Sparkles,
  Users,
  Wheat,
  Wine,
} from "lucide-react";
import {
  CATEGORY_CARD_FALLBACK_THEME,
  CATEGORY_THEME_BY_SLUG,
} from "@/lib/categoryThemes";

const CATEGORY_ICON_MAP = {
  Sparkles,
  Beef,
  Milk,
  Wine,
  Droplet,
  Wheat,
  LeafyGreen,
  Snowflake,
  Fish,
  Package,
  ShoppingBasket,
  Users,
  LayoutGrid,
};

/**
 * Shop category tile — soft neutral gradient + shared gray icon treatment.
 */
export function CategoryCard({ name, count, slug, layoutVariant = 0 }) {
  const theme =
    CATEGORY_THEME_BY_SLUG[slug] ?? CATEGORY_CARD_FALLBACK_THEME;
  const Icon = CATEGORY_ICON_MAP[theme.icon] ?? LayoutGrid;

  const shapeClass =
    layoutVariant % 3 === 0
      ? "rounded-2xl"
      : layoutVariant % 3 === 1
        ? "rounded-2xl rounded-br-3xl rounded-tl-3xl"
        : "rounded-3xl";

  return (
    <Link
      href={`/${slug}`}
      className={`group relative box-border flex h-full min-h-[132px] w-full min-w-0 touch-manipulation flex-col overflow-hidden border px-2.5 pb-5 pt-4 shadow-sm transition-[box-shadow,border-color] duration-200 [-webkit-tap-highlight-color:transparent] hover:border-neutral-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 sm:min-h-[152px] sm:px-4 sm:pb-6 sm:pt-5 ${shapeClass}`}
      style={{
        background: `linear-gradient(160deg, ${theme.from} 0%, ${theme.to} 100%)`,
        borderColor: theme.border,
      }}
    >
      <span
        className="relative mx-auto mb-3 flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-200/60 text-neutral-600 ring-1 ring-neutral-900/[0.06] sm:mb-3.5 sm:size-12"
      >
        <Icon className="size-[22px] sm:size-6" strokeWidth={1.75} aria-hidden />
      </span>

      <span className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-balance break-words text-center text-neutral-900">
        <span className="text-[15px] font-semibold leading-snug tracking-tight sm:text-[1.05rem] sm:leading-tight">
          {name}
        </span>
        <span className="mt-2 shrink-0 text-xs font-normal tabular-nums leading-normal text-neutral-500 sm:text-sm">
          {count} items
        </span>
      </span>
    </Link>
  );
}
