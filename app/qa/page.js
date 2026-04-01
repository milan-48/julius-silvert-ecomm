import { fetchQaIssuesFromGoogleSheet } from "@/lib/qa/fetchIssuesFromGoogleSheet";
import { getQaSheetEditConfig } from "@/lib/qa/googleSheetRowUrl";
import { QaIssuesTable } from "./QaIssuesTable";

export const metadata = {
  title: "QA issues",
  description: "Julius Silvert bug list — QA tracking",
};

/** Load from Google Sheets at request time (export URL needs a public sheet). */
export const dynamic = "force-dynamic";

export default async function QaPage() {
  const { rows, error } = await fetchQaIssuesFromGoogleSheet();
  const sheetLink = getQaSheetEditConfig();

  return (
    <div className="site-container max-w-[1600px] py-8 sm:py-12">
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Internal
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          QA issues
        </h1>
      </div>

      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {error}
        </p>
      ) : null}

      {!error && rows.length === 0 ? (
        <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          No issues found. Check the sheet has a header row and data below it.
        </p>
      ) : null}

      {!error && rows.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-neutral-600">
            <span className="font-semibold tabular-nums text-neutral-900">
              {rows.length}
            </span>{" "}
            issues
          </p>
          <QaIssuesTable initialRows={rows} sheetLink={sheetLink} />
        </>
      ) : null}
    </div>
  );
}
