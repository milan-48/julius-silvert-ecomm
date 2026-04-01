const DEFAULT_SHEET_ID = "1qQuhOC5pBHpO_qB72647n8iZR1RXE4odd84Pf68VSxg";

/** Tab gid for “open this row” edit links (Issues tab), not necessarily CSV export gid */
const DEFAULT_EDIT_GID = "1273434837";

/**
 * Editor row on the Issues tab (column A) does not follow SN order — use explicit map when known.
 * Add a “Sheet Row” column in the CSV for any SN not listed here.
 */
const SN_TO_SHEET_ROW = Object.freeze({
  "3": 117,
  "4": 150,
  "5": 181,
  "11": 65,
  "20": 34,
  "22": 96,
  "24": 213,
  "28": 247,
  "30": 268,
});

/**
 * @returns {{ spreadsheetId: string; editGid: string }}
 */
export function getQaSheetEditConfig() {
  return {
    spreadsheetId: (process.env.GOOGLE_SHEETS_QA_ID || DEFAULT_SHEET_ID).trim(),
    editGid: (process.env.GOOGLE_SHEETS_QA_EDIT_GID || DEFAULT_EDIT_GID).trim(),
  };
}

/**
 * @param {string} spreadsheetId
 * @param {string} editGid
 * @param {number | null | undefined} sheetRow 1-based sheet row, or null to open the tab only
 */
export function buildSheetRowEditUrl(spreadsheetId, editGid, sheetRow) {
  const id = spreadsheetId.trim();
  const gid = editGid.trim();
  const base = `https://docs.google.com/spreadsheets/d/${id}/edit?gid=${gid}#gid=${gid}`;
  if (sheetRow == null) return base;
  const row = Math.max(1, Math.floor(sheetRow));
  if (!Number.isFinite(row)) return base;
  return `${base}&range=A${row}`;
}

/**
 * @param {{ sn: string; sheetRow?: string }} row
 */
export function spreadsheetRowForIssue(row) {
  const fromCsv = String(row.sheetRow ?? "").trim();
  if (fromCsv) {
    const n = Number.parseInt(fromCsv, 10);
    if (Number.isFinite(n) && n >= 1) return n;
  }
  const sn = String(row.sn ?? "").trim();
  if (sn in SN_TO_SHEET_ROW) return SN_TO_SHEET_ROW[sn];
  return null;
}
