/**
 * Parse one CSV row with quoted fields (RFC-style).
 * @param {string} row
 * @returns {string[]}
 */
export function parseCsvRow(row) {
  const fields = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (inQuotes) {
      if (c === '"') {
        if (row[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      fields.push(field.trim());
      field = "";
    } else {
      field += c;
    }
  }
  fields.push(field.trim());
  return fields;
}

/**
 * One physical line per record (matches current bug CSV). Quoted fields may contain commas.
 * @param {string} text
 * @returns {string[]}
 */
export function splitCsvRecords(text) {
  return text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * @returns {{ priority: string; sn: string; issue: string; module: string; qaStatus: string; devStatus: string; remark: string; sheetRow: string }[]}
 */
export function parseQaIssuesCsv(text) {
  const records = splitCsvRecords(text);
  if (records.length < 2) return [];

  const header = parseCsvRow(records[0]).map((h) => h.toLowerCase());

  const col = {
    priority: header.indexOf("priority"),
    sn: header.indexOf("sn"),
    issue: header.indexOf("issue"),
    module: header.indexOf("module"),
    qaStatus: header.indexOf("qa status"),
    devStatus: header.indexOf("dev status"),
    remark: header.indexOf("remark"),
    sheetRow: header.indexOf("sheet row"),
  };

  const out = [];
  for (let r = 1; r < records.length; r++) {
    const cells = parseCsvRow(records[r]);
    if (cells.length < 5) continue;
    out.push({
      priority: cells[col.priority] ?? "",
      sn: cells[col.sn] ?? String(r),
      issue: cells[col.issue] ?? "",
      module: cells[col.module] ?? "",
      qaStatus: cells[col.qaStatus] ?? "Open",
      devStatus: cells[col.devStatus] ?? "Open",
      remark: cells[col.remark] ?? "",
      sheetRow:
        col.sheetRow >= 0 ? (cells[col.sheetRow] ?? "").trim() : "",
    });
  }
  return out;
}

export const QA_STATUS_OPTIONS = ["Open", "Retest", "Reopen", "Closed"];

export const DEV_STATUS_OPTIONS = ["Open", "In Progress", "Fixed", "Voided"];
