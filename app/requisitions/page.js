import Link from "next/link";

export const metadata = {
  title: "Requisition list | Julius Silvert",
  description: "Requisition list — details coming soon.",
};

/**
 * Placeholder until requisition list behavior is defined.
 */
export default function RequisitionsPage() {
  return (
    <main className="site-container py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
        Requisition list
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-neutral-600">
        This page will show your requisition list once the flow is defined.
      </p>
      <p className="mt-6">
        <Link
          href="/"
          className="text-[15px] font-medium text-[#E7000B] underline-offset-4 hover:underline"
        >
          Back to home
        </Link>
      </p>
    </main>
  );
}
