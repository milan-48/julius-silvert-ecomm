/** Static skeletons for category PLP — safe for `loading.js` (no client hooks). */

function PulseBlock({ className }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/80 ${className ?? ""}`}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
      <PulseBlock className="aspect-[4/3] w-full rounded-b-none rounded-t-2xl" />
      <div className="space-y-3 p-4">
        <PulseBlock className="h-3 w-16" />
        <PulseBlock className="h-4 w-full max-w-[90%]" />
        <PulseBlock className="h-3 w-24" />
        <PulseBlock className="h-3 w-32" />
        <div className="flex items-end justify-between gap-2 pt-1">
          <PulseBlock className="h-7 w-20" />
          <PulseBlock className="h-3 w-14" />
        </div>
        <PulseBlock className="mt-2 h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function CategoryListingPageSkeleton() {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <PulseBlock className="h-3 w-12" />
        <PulseBlock className="h-3 w-3" />
        <PulseBlock className="h-3 w-28" />
      </div>
      <PulseBlock className="mt-5 h-9 w-48 max-w-[80%] sm:h-10 sm:w-64" />
      <div className="mt-8">
        <div className="mb-6 flex justify-end lg:mb-8">
          <PulseBlock className="h-10 w-52 rounded-lg" />
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-10 xl:gap-12">
          <div
            className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.06)] sm:p-6"
            aria-hidden
          >
            <PulseBlock className="h-4 w-20" />
            <div className="mt-5 space-y-4 border-t border-neutral-200 pt-4">
              <PulseBlock className="h-4 w-full" />
              <PulseBlock className="h-3 w-3/4" />
              <PulseBlock className="h-3 w-2/3" />
              <PulseBlock className="mt-6 h-4 w-full" />
              <PulseBlock className="h-3 w-1/2" />
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i}>
                <ProductCardSkeleton />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="sr-only">Loading category…</p>
    </div>
  );
}
