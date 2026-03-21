import Link from "next/link";
import { CategoryListingPage } from "@/components/categoryListing/CategoryListingPage";
import { ProductDetailPage } from "@/components/productDetail/ProductDetailPage";
import { findCategoryBySlug } from "@/lib/constants";
import {
  findMegaMenuLinkByHref,
  humanizePathSegment,
} from "@/lib/navMegaMenu";
import { listProductsByCategory } from "@/lib/memoryDb/queries";
import { withStockView } from "@/lib/memoryDb/stockUtils";
import { getProductDetailBySlug } from "@/lib/productCatalog";

/** Same as home — catalog reads live memory DB (stock count updates must reflect on PLP/PDP). */
export const dynamic = "force-dynamic";

function CatalogPlaceholder({ path }) {
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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parts = Array.isArray(slug) ? slug : slug != null ? [String(slug)] : [];

  if (parts.length === 1) {
    const product = getProductDetailBySlug(parts[0]);
    if (product) {
      return {
        title: `${product.title} | Julius Silvert`,
        description: product.tabDescription?.slice(0, 155) ?? undefined,
      };
    }
  }

  if (parts.length === 2) {
    const parent = findCategoryBySlug(parts[0]);
    if (parent) {
      const path = `/${parts[0]}/${parts[1]}`;
      const mega = findMegaMenuLinkByHref(path);
      const subName = mega?.label ?? humanizePathSegment(parts[1]);
      return {
        title: `${subName} | ${parent.name} | Julius Silvert`,
        description: `Shop ${subName} in ${parent.name} at Julius Silvert.`,
      };
    }
  }

  return {};
}

export default async function CatalogRoutePage({ params }) {
  const { slug } = await params;
  const parts = Array.isArray(slug) ? slug : slug != null ? [String(slug)] : [];

  if (parts.length === 1) {
    const segment = parts[0];
    const category = findCategoryBySlug(segment);
    if (category) {
      const products = listProductsByCategory(segment).map(withStockView);
      return <CategoryListingPage category={category} products={products} />;
    }
    const product = getProductDetailBySlug(segment);
    if (product) {
      return <ProductDetailPage product={product} />;
    }
  }

  if (parts.length === 2) {
    const parentSlug = parts[0];
    const childSegment = parts[1];
    const parentCategory = findCategoryBySlug(parentSlug);
    if (parentCategory) {
      const path = `/${parentSlug}/${childSegment}`;
      const mega = findMegaMenuLinkByHref(path);
      const subName = mega?.label ?? humanizePathSegment(childSegment);
      const products = listProductsByCategory(parentSlug).map(withStockView);
      return (
        <CategoryListingPage
          category={{ name: subName, slug: `${parentSlug}/${childSegment}` }}
          parentCategory={{
            name: parentCategory.name,
            slug: parentSlug,
          }}
          products={products}
        />
      );
    }
  }

  const path = parts.join("/");
  return <CatalogPlaceholder path={path} />;
}
