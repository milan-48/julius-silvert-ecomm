import { parseQaIssuesCsv } from "@/lib/qa/parseIssuesCsv";

/** Default spreadsheet from product QA bug list */
const DEFAULT_SHEET_ID = "1qQuhOC5pBHpO_qB72647n8iZR1RXE4odd84Pf68VSxg";

/**
 * Public CSV export URL (no API key). Sheet must be shared:
 * “Anyone with the link” → Viewer, or File → Share → Publish to web.
 *
 * @see https://docs.google.com/spreadsheets/d/{id}/edit — gid in URL hash = sheet tab
 */
function buildExportUrl(sheetId, gid, bustCache = false) {
  const id = encodeURIComponent(sheetId);
  const g = encodeURIComponent(gid);
  let u = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${g}`;
  /** Bust Google / proxy caches so new rows show up immediately */
  if (bustCache) {
    u += `&_=${Date.now()}`;
  }
  return u;
}

/**
 * @returns {Promise<{ rows: ReturnType<typeof parseQaIssuesCsv>; error: string | null }>}
 */
export async function fetchQaIssuesFromGoogleSheet() {
  const sheetId = (process.env.GOOGLE_SHEETS_QA_ID || DEFAULT_SHEET_ID).trim();
  const gid = (process.env.GOOGLE_SHEETS_QA_GID || "0").trim();
  const url = buildExportUrl(sheetId, gid, true);

  try {
    const res = await fetch(url, {
      /** Always fresh — revalidate:120 hid new rows for up to 2 minutes */
      cache: "no-store",
      headers: {
        Accept: "text/csv,text/plain;q=0.9,*/*;q=0.8",
        "Cache-Control": "no-cache",
      },
    });

    if (!res.ok) {
      return {
        rows: [],
        error: `Could not load sheet (HTTP ${res.status}). Check sharing settings.`,
      };
    }

    const text = await res.text();
    const start = text.trimStart();

    if (start.startsWith("<!") || start.startsWith("<html")) {
      return {
        rows: [],
        error:
          "Google did not return CSV (likely sign-in page). Share the spreadsheet with “Anyone with the link” as Viewer so export works without login.",
      };
    }

    const rows = parseQaIssuesCsv(text);
    return { rows, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return {
      rows: [],
      error: `Failed to fetch sheet: ${msg}`,
    };
  }
}
