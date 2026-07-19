import { useState, useMemo } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Download, Upload, X } from "lucide-react";
import SEO from "../components/SEO";
import CopyButton from "../components/CopyButton";
import FieldWarnings from "../components/FieldWarnings";
import { ALL_PARAMS, SOURCE_PRESETS, MEDIUM_PRESETS, pushHistory } from "../utils/utm";
import { lintUtmValue, getParamHistory, addParamHistoryValue } from "../utils/utmLint";
import { rowsFromPaste, rowsFromCsv, processBulkRows, CSV_COLUMNS } from "../utils/bulkUtm";
import { parseCsv, downloadCsv } from "../utils/csv";

const EMPTY_SHARED = { utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" };

const STATUS_CONFIG = {
  ok: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "OK" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", label: "Warning" },
  skipped: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Skipped" },
};

export default function BulkUtmGenerator() {
  const [mode, setMode] = useState("paste");
  const [sharedParams, setSharedParams] = useState(EMPTY_SHARED);
  const [pasteText, setPasteText] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [csvRows, setCsvRows] = useState([]);
  const [csvError, setCsvError] = useState(null);
  const [paramHistory, setParamHistory] = useState(() => {
    const h = {};
    ALL_PARAMS.forEach((k) => {
      h[k] = getParamHistory(k);
    });
    return h;
  });

  function updateShared(key, value) {
    setSharedParams((s) => ({ ...s, [key]: value }));
  }

  function applyFix(w) {
    updateShared(w.param, w.fix(sharedParams[w.param]));
  }

  const sharedWarnings = useMemo(() => {
    const w = {};
    ALL_PARAMS.forEach((k) => {
      w[k] = lintUtmValue(k, sharedParams[k], paramHistory[k]);
    });
    return w;
  }, [sharedParams, paramHistory]);

  const rowInputs = useMemo(() => {
    return mode === "paste" ? rowsFromPaste(pasteText, sharedParams) : csvRows;
  }, [mode, pasteText, sharedParams, csvRows]);

  const results = useMemo(() => processBulkRows(rowInputs, paramHistory), [rowInputs, paramHistory]);

  const counts = useMemo(() => {
    const c = { ok: 0, warning: 0, skipped: 0 };
    results.forEach((r) => c[r.status]++);
    return c;
  }, [results]);

  const successRows = results.filter((r) => r.status !== "skipped");

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    setCsvError(null);
    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      const { error, rows } = rowsFromCsv(parsed);
      if (error) {
        setCsvError(error);
        setCsvRows([]);
      } else {
        setCsvRows(rows);
      }
    } catch {
      setCsvError("Could not read that file. Make sure it's a valid CSV.");
      setCsvRows([]);
    }
    e.target.value = "";
  }

  function handleClearCsv() {
    setCsvFileName("");
    setCsvRows([]);
    setCsvError(null);
  }

  function handleDownload() {
    const rows = [["url", "tagged_url"], ...successRows.map((r) => [r.originalUrl, r.taggedUrl])];
    downloadCsv("adsgear-bulk-utm.csv", rows);
  }

  function handleSaveToHistory() {
    rowInputs.forEach((row, i) => {
      const result = results[i];
      if (!result || result.status === "skipped") return;
      ALL_PARAMS.forEach((p) => addParamHistoryValue(p, row[p]));
      pushHistory(result.taggedUrl);
    });
    const h = {};
    ALL_PARAMS.forEach((k) => {
      h[k] = getParamHistory(k);
    });
    setParamHistory(h);
  }

  const copyAllText = successRows.map((r) => r.taggedUrl).join("\n");

  return (
    <>
      <SEO
        title="Bulk UTM Generator"
        description="Generate dozens of tagged campaign URLs at once — paste a list or upload a CSV, with the same naming-convention linting as the UTM Builder."
        path="/bulk-utm-generator"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">Bulk UTM Generator</h1>
        <p className="text-slate-600 mt-2 mb-8">
          Tag many URLs at once. Paste a list with shared params, or upload a CSV with per-row values.
        </p>

        <div className="space-y-4">
          {/* Card 1 — Mode toggle */}
          <div className="card">
            <div className="inline-flex rounded-lg border border-slate-200 p-1">
              {[
                { key: "paste", label: "Paste URLs" },
                { key: "csv", label: "Upload CSV" },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMode(m.key)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-md transition-colors ${
                    mode === m.key ? "bg-brand-600 text-white" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {mode === "paste" ? (
            <>
              {/* Card 2 — Shared params */}
              <div className="card">
                <span className="label-sm block mb-3">Shared params (applied to every URL)</span>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block">
                      <span className="label-sm block mb-1.5">Source *</span>
                      <input
                        type="text"
                        value={sharedParams.utm_source}
                        onChange={(e) => updateShared("utm_source", e.target.value)}
                        placeholder="google"
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                      />
                    </label>
                    <FieldWarnings warnings={sharedWarnings.utm_source} onFix={applyFix} />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {SOURCE_PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateShared("utm_source", p)}
                          className="text-xs font-medium bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 rounded-full px-2.5 py-1 transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block">
                      <span className="label-sm block mb-1.5">Medium *</span>
                      <input
                        type="text"
                        value={sharedParams.utm_medium}
                        onChange={(e) => updateShared("utm_medium", e.target.value)}
                        placeholder="cpc"
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                      />
                    </label>
                    <FieldWarnings warnings={sharedWarnings.utm_medium} onFix={applyFix} />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {MEDIUM_PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateShared("utm_medium", p)}
                          className="text-xs font-medium bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 rounded-full px-2.5 py-1 transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="block">
                    <span className="label-sm block mb-1.5">Campaign</span>
                    <input
                      type="text"
                      value={sharedParams.utm_campaign}
                      onChange={(e) => updateShared("utm_campaign", e.target.value)}
                      placeholder="spring-launch-2026"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                    />
                    <FieldWarnings warnings={sharedWarnings.utm_campaign} onFix={applyFix} />
                  </label>

                  <label className="block">
                    <span className="label-sm block mb-1.5">Content</span>
                    <input
                      type="text"
                      value={sharedParams.utm_content}
                      onChange={(e) => updateShared("utm_content", e.target.value)}
                      placeholder="carousel-ad-1"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                    />
                    <FieldWarnings warnings={sharedWarnings.utm_content} onFix={applyFix} />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="label-sm block mb-1.5">Term (optional)</span>
                    <input
                      type="text"
                      value={sharedParams.utm_term}
                      onChange={(e) => updateShared("utm_term", e.target.value)}
                      placeholder="running-shoes"
                      className="w-full sm:w-1/2 rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                    />
                    <FieldWarnings warnings={sharedWarnings.utm_term} onFix={applyFix} />
                  </label>
                </div>
              </div>

              {/* Card 3 — URL list */}
              <div className="card">
                <span className="label-sm block mb-1.5">Destination URLs (one per line)</span>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={"https://example.com/landing-a\nhttps://example.com/landing-b\nhttps://example.com/landing-c"}
                  rows={6}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm mono focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                />
              </div>
            </>
          ) : (
            <div className="card">
              <span className="label-sm block mb-1.5">CSV file</span>
              <p className="text-xs text-slate-400 mb-3">
                Header row must be: <span className="mono text-slate-500">{CSV_COLUMNS.join(",")}</span> (term and
                content columns can be left blank per row).
              </p>

              {!csvFileName ? (
                <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg py-8 cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-colors">
                  <Upload size={20} className="text-slate-400" />
                  <span className="text-sm text-slate-500">Click to choose a .csv file</span>
                  <input type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="flex items-center justify-between gap-3 border border-slate-200 rounded-lg px-3.5 py-2.5">
                  <span className="text-sm text-slate-700 mono truncate">{csvFileName}</span>
                  <button
                    type="button"
                    onClick={handleClearCsv}
                    className="text-slate-400 hover:text-red-500 shrink-0"
                    aria-label="Remove CSV file"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {csvError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3.5 py-2.5 mt-3">
                  {csvError}
                </div>
              )}
            </div>
          )}

          {/* Card 4 — Results */}
          {results.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3 text-xs font-medium">
                  <span className="flex items-center gap-1 text-green-700">
                    <CheckCircle2 size={13} /> {counts.ok} OK
                  </span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <AlertTriangle size={13} /> {counts.warning} warning{counts.warning === 1 ? "" : "s"}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <XCircle size={13} /> {counts.skipped} skipped
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveToHistory}
                    disabled={successRows.length === 0}
                    className="text-xs font-medium text-slate-600 hover:text-brand-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Save to session history
                  </button>
                  <CopyButton text={copyAllText} label="Copy all" />
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={successRows.length === 0}
                    className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white transition-colors"
                  >
                    <Download size={14} />
                    Download CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                      <th className="py-2 px-1 font-medium">Status</th>
                      <th className="py-2 px-1 font-medium">Original URL</th>
                      <th className="py-2 px-1 font-medium">Generated URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => {
                      const cfg = STATUS_CONFIG[r.status];
                      const Icon = cfg.icon;
                      return (
                        <tr key={r.index} className="border-b border-slate-50 last:border-0 align-top">
                          <td className="py-2.5 px-1">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
                              <Icon size={13} /> {cfg.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-1 mono text-xs text-slate-500 max-w-[220px] truncate" title={r.originalUrl}>
                            {r.originalUrl || "—"}
                          </td>
                          <td className="py-2.5 px-1">
                            {r.taggedUrl ? (
                              <p className="mono text-xs text-slate-700 break-all">{r.taggedUrl}</p>
                            ) : (
                              <span className="text-xs text-slate-300">—</span>
                            )}
                            {r.reasons.length > 0 && (
                              <ul className="mt-1 space-y-0.5">
                                {r.reasons.map((reason, i) => (
                                  <li key={i} className={`text-[11px] ${r.status === "skipped" ? "text-red-500" : "text-amber-600"}`}>
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
