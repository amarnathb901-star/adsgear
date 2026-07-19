// Bulk UTM generator — paste/CSV row parsing and batch tagging.
// Reuses buildUtmUrl (utm.js) and lintUtmValue (utmLint.js) so a single row/URL is
// linted and tagged identically here and in the UTM Builder.

import { buildUtmUrl, paramLabel, ALL_PARAMS } from "./utm";
import { lintUtmValue } from "./utmLint";

export const CSV_COLUMNS = ["url", "source", "medium", "campaign", "term", "content"];

const COLUMN_TO_PARAM = {
  source: "utm_source",
  medium: "utm_medium",
  campaign: "utm_campaign",
  term: "utm_term",
  content: "utm_content",
};

// Turns raw parsed CSV rows (array of string arrays, header included) into row objects
// keyed by internal param names. Returns { error, rows } — error is set (rows empty)
// when the header doesn't match the expected columns.
export function rowsFromCsv(csvRows) {
  if (csvRows.length === 0) {
    return { error: "The CSV file is empty.", rows: [] };
  }

  const header = csvRows[0].map((h) => h.trim().toLowerCase());
  const headerSet = new Set(header);
  const expectedSet = new Set(CSV_COLUMNS);
  const missing = CSV_COLUMNS.filter((c) => !headerSet.has(c));
  const unexpected = header.filter((h) => !expectedSet.has(h));

  if (missing.length > 0 || unexpected.length > 0) {
    const parts = [`CSV header must contain exactly these columns: ${CSV_COLUMNS.join(", ")}.`];
    if (missing.length) parts.push(`Missing: ${missing.join(", ")}.`);
    if (unexpected.length) parts.push(`Unexpected: ${unexpected.join(", ")}.`);
    return { error: parts.join(" "), rows: [] };
  }

  const colIndex = {};
  header.forEach((h, i) => {
    colIndex[h] = i;
  });

  const rows = csvRows
    .slice(1)
    .filter((r) => r.some((cell) => cell.trim() !== ""))
    .map((r) => {
      const row = { url: (r[colIndex.url] || "").trim() };
      Object.entries(COLUMN_TO_PARAM).forEach(([col, param]) => {
        row[param] = (r[colIndex[col]] || "").trim();
      });
      return row;
    });

  return { error: null, rows };
}

// Splits pasted textarea content (one URL per line) into row objects using one
// shared param set applied to every row.
export function rowsFromPaste(text, sharedParams) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((url) => ({ url, ...sharedParams }));
}

// Tags + lints each row. paramHistory is the { utm_source: [...], ... } map from
// utmLint.getParamHistory, precomputed once by the caller (avoids re-reading
// localStorage per row/param).
export function processBulkRows(rowInputs, paramHistory = {}) {
  const seen = new Map();

  return rowInputs.map((row, index) => {
    const url = (row.url || "").trim();
    const built = buildUtmUrl(url, row);

    if (!built.hasBase) {
      return {
        index,
        originalUrl: row.url || "",
        taggedUrl: "",
        status: "skipped",
        reasons: [built.error || "Missing or invalid URL"],
        warnings: [],
      };
    }

    const warnings = ALL_PARAMS.flatMap((p) => lintUtmValue(p, row[p], paramHistory[p] || []));
    const reasons = [];
    let status = "ok";

    if (built.missing.length > 0) {
      reasons.push(`Missing required: ${built.missing.map(paramLabel).join(", ")}`);
      status = "warning";
    }
    if (warnings.length > 0) {
      status = "warning";
    }

    const signature = [url.toLowerCase(), ...ALL_PARAMS.map((p) => (row[p] || "").trim().toLowerCase())].join("|");
    if (seen.has(signature)) {
      reasons.push(`Possible duplicate of row ${seen.get(signature) + 1}`);
      status = "warning";
    } else {
      seen.set(signature, index);
    }

    return { index, originalUrl: url, taggedUrl: built.url, status, reasons, warnings };
  });
}
