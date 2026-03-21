import Link from "next/link";

/**
 * Placeholder for catalog routes linked from the mega-menu.
 * Replace with real segment pages or delete this file once routes exist.
 */
export default async function CatalogPlaceholderPage({ params }) {
  const { slug } = await params;
  const path = Array.isArray(slug) ? slug.join("/") : String(slug ?? "");

  return (
    <div className="bg-white">
      <div className="site-container py-16 sm:py-24">
        <p className="text-sm font-medium text-neutral-500">Catalog</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
          Coming soon
        </h1>
        <p className="mt-3 max-w-xl text-neutral-600">
          This page is ready for your content. Path:{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm">
            /{path}
          </code>
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-semibold text-[#E7000B] hover:text-[#c40009]"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
