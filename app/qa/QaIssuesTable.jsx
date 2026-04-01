"use client";

import { Fragment, useCallback, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { DEV_STATUS_OPTIONS, QA_STATUS_OPTIONS } from "@/lib/qa/parseIssuesCsv";
import {
  buildSheetRowEditUrl,
  spreadsheetRowForIssue,
} from "@/lib/qa/googleSheetRowUrl";

const selectClass =
  "max-w-[9.5rem] cursor-pointer rounded-md border border-neutral-200 bg-white py-1 pl-2 pr-7 text-xs font-medium " +
  "text-neutral-800 shadow-sm focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10";

function priorityStyles(p) {
  const x = String(p ?? "").toUpperCase();
  if (x.startsWith("P1"))
    return "bg-rose-100 text-rose-900 ring-1 ring-rose-200/80";
  if (x.startsWith("P2"))
    return "bg-amber-100 text-amber-950 ring-1 ring-amber-200/80";
  if (x.startsWith("P3"))
    return "bg-neutral-100 text-neutral-800 ring-1 ring-neutral-200/80";
  return "bg-neutral-50 text-neutral-700 ring-1 ring-neutral-200/60";
}

/**
 * @param {{
 *   initialRows: Array<Record<string, string>>;
 *   sheetLink: { spreadsheetId: string; editGid: string };
 * }} props
 */
export function QaIssuesTable({ initialRows, sheetLink }) {
  const [rows, setRows] = useState(() =>
    initialRows.map((r) => ({
      ...r,
      qaStatus: normalizeQa(r.qaStatus),
      devStatus: normalizeDev(r.devStatus),
    })),
  );
  const [expanded, setExpanded] = useState(() => new Set());

  const toggle = useCallback((sn) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sn)) next.delete(sn);
      else next.add(sn);
      return next;
    });
  }, []);

  const setQa = useCallback((sn, value) => {
    setRows((prev) =>
      prev.map((r) => (r.sn === sn ? { ...r, qaStatus: value } : r)),
    );
  }, []);

  const setDev = useCallback((sn, value) => {
    setRows((prev) =>
      prev.map((r) => (r.sn === sn ? { ...r, devStatus: value } : r)),
    );
  }, []);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const na = Number(a.sn);
      const nb = Number(b.sn);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
      return String(a.sn).localeCompare(String(b.sn));
    });
  }, [rows]);

  const { spreadsheetId, editGid } = sheetLink;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200/90 bg-white shadow-sm">
      <div
        className="max-h-[min(70vh,44rem)] overflow-y-auto overflow-x-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]"
        style={{ scrollbarGutter: "stable" }}
        role="region"
        aria-label="QA issues table"
      >
        <table className="w-full min-w-[980px] table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col style={{ width: "3.25rem" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "32%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "4.5rem" }} />
          </colgroup>
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-neutral-200 bg-neutral-50 shadow-[0_1px_0_0_rgb(229_231_235)]">
              <th
                className="bg-neutral-50 px-2 py-3"
                aria-label="Expand"
              />
              <th className="whitespace-nowrap bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-800 sm:text-sm">
                Priority
              </th>
              <th className="whitespace-nowrap bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-800 sm:text-sm">
                SN
              </th>
              <th className="bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-800 sm:text-sm">
                Issue
              </th>
              <th className="bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-800 sm:text-sm">
                Module
              </th>
              <th className="bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-800 sm:text-sm">
                QA status
              </th>
              <th className="bg-neutral-50 px-3 py-3 text-xs font-semibold text-neutral-800 sm:text-sm">
                Dev status
              </th>
              <th className="bg-neutral-50 px-2 py-3 text-center text-xs font-semibold text-neutral-800 sm:text-sm">
                Sheet
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const isOpen = expanded.has(row.sn);
              const remark = String(row.remark ?? "").trim();
              const sheetRow = spreadsheetRowForIssue(row);
              const sheetUrl = buildSheetRowEditUrl(
                spreadsheetId,
                editGid,
                sheetRow,
              );
              const sheetTitle =
                sheetRow != null
                  ? `Open row ${sheetRow} in Google Sheet`
                  : "Open Issues tab in Google Sheet";
              return (
                <Fragment key={row.sn}>
                  <tr
                    className="cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50/90"
                    onClick={() => toggle(row.sn)}
                  >
                    <td className="min-w-0 px-2 py-3 align-top text-neutral-500">
                      <span className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-neutral-100">
                        {isOpen ? (
                          <ChevronDown className="size-4" aria-hidden />
                        ) : (
                          <ChevronRight className="size-4" aria-hidden />
                        )}
                      </span>
                    </td>
                    <td className="min-w-0 px-3 py-3 align-top">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold tabular-nums ${priorityStyles(row.priority)}`}
                      >
                        {row.priority}
                      </span>
                    </td>
                    <td className="min-w-0 whitespace-nowrap px-3 py-3 align-top font-mono tabular-nums text-neutral-800">
                      {row.sn}
                    </td>
                    <td className="min-w-0 px-3 py-3 align-top text-neutral-800">
                      <span className="line-clamp-3 break-words">{row.issue}</span>
                    </td>
                    <td className="min-w-0 px-3 py-3 align-top text-neutral-600">
                      <span className="line-clamp-2 break-words">{row.module}</span>
                    </td>
                    <td
                      className="min-w-0 px-3 py-3 align-top"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        className={`${selectClass} max-w-full`}
                        value={row.qaStatus}
                        onChange={(e) => setQa(row.sn, e.target.value)}
                        aria-label={`QA status for issue ${row.sn}`}
                      >
                        {QA_STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      className="min-w-0 px-3 py-3 align-top"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        className={`${selectClass} max-w-full`}
                        value={row.devStatus}
                        onChange={(e) => setDev(row.sn, e.target.value)}
                        aria-label={`Dev status for issue ${row.sn}`}
                      >
                        {DEV_STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      className="min-w-0 px-1 py-3 align-middle text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={sheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={sheetTitle}
                        className="inline-flex size-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-blue-600"
                        aria-label={
                          sheetRow != null
                            ? `Open issue ${row.sn} in Google Sheet (row ${sheetRow})`
                            : `Open issue ${row.sn} in Google Sheet`
                        }
                      >
                        <ExternalLink className="size-4" strokeWidth={2} aria-hidden />
                      </a>
                    </td>
                  </tr>
                  {isOpen ? (
                    <tr
                      key={`${row.sn}-detail`}
                      className="border-b border-neutral-100 bg-neutral-50/70"
                    >
                      <td
                        colSpan={8}
                        className="min-w-0 px-4 py-4 sm:px-6 sm:py-5"
                      >
                        <div className="w-full min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                            Remarks
                          </p>
                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-neutral-700">
                            {remark || "—"}
                          </p>
                          <a
                            href={sheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                            {sheetRow != null
                              ? `Open this row in Google Sheet (row ${sheetRow})`
                              : "Open this issue in Google Sheet"}
                          </a>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function normalizeQa(v) {
  const s = String(v ?? "").trim();
  if (QA_STATUS_OPTIONS.includes(s)) return s;
  return "Open";
}

function normalizeDev(v) {
  const s = String(v ?? "").trim();
  if (DEV_STATUS_OPTIONS.includes(s)) return s;
  if (/^in\s*prog/i.test(s)) return "In Progress";
  return s === "Open" || s === "" ? "Open" : s;
}
