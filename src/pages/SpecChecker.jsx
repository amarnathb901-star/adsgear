import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import SEO from "../components/SEO";
import specsData from "../data/specs.json";

const PLATFORMS = Object.entries(specsData).map(([key, val]) => ({ key, label: val.label }));

function evaluateCheck(check, values) {
  const rawVal = values[check.key];
  if (rawVal === undefined || rawVal === "" || rawVal === null) {
    return { status: "unknown" };
  }

  if (check.key === "fileType") {
    const yours = String(rawVal).trim().toLowerCase().replace(/^\./, "");
    const pass = check.required.includes(yours);
    return { status: pass ? "pass" : "fail", yours };
  }

  const yours = Number(rawVal);
  if (!Number.isFinite(yours)) return { status: "unknown" };

  if (check.type === "max") {
    return { status: yours <= check.required ? "pass" : "fail", yours };
  }
  // exact match for width/height (allow user to be >= required for flexibility on min-spec formats)
  return { status: yours === check.required ? "pass" : "fail", yours };
}

export default function SpecChecker() {
  const [platform, setPlatform] = useState(null);
  const [format, setFormat] = useState(null);
  const [values, setValues] = useState({ width: "", height: "", fileSize: "", fileType: "" });

  const formats = platform ? Object.entries(specsData[platform].formats) : [];
  const formatData = platform && format ? specsData[platform].formats[format] : null;

  const results = useMemo(() => {
    if (!formatData) return [];
    return formatData.checks.map((check) => ({ check, ...evaluateCheck(check, values) }));
  }, [formatData, values]);

  const anyEntered = Object.values(values).some((v) => v !== "");
  const passCount = results.filter((r) => r.status === "pass").length;
  const failCount = results.filter((r) => r.status === "fail").length;
  const totalGraded = results.length;

  function selectPlatform(key) {
    setPlatform(key);
    setFormat(null);
    setValues({ width: "", height: "", fileSize: "", fileType: "" });
  }

  function update(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  return (
    <>
      <SEO
        title="Ad Spec Checker"
        description="Check your ad creative dimensions, file size, and file type against Meta, Google, LinkedIn, YouTube, and DV360 specs — instantly, for free."
        path="/ad-spec-checker"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">Ad Creative Spec Checker</h1>
        <p className="text-slate-600 mt-2 mb-8">
          Select a platform and format — instant pass/fail against official requirements.
        </p>

        <div className="space-y-4">
          {/* Card 1 — Platform + Format */}
          <div className="card">
            <span className="label-sm block mb-2">Platform</span>
            <div className="flex flex-wrap gap-2 mb-5">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => selectPlatform(p.key)}
                  className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                    platform === p.key
                      ? "bg-brand-600 border-brand-600 text-white"
                      : "bg-white border-slate-200 text-slate-600 hover:border-brand-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {platform && (
              <label className="block max-w-xs">
                <span className="label-sm block mb-1.5">Format</span>
                <select
                  value={format || ""}
                  onChange={(e) => setFormat(e.target.value || null)}
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none bg-white"
                >
                  <option value="">Select a format…</option>
                  {formats.map(([key, f]) => (
                    <option key={key} value={key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {/* Card 2 — Your creative specs */}
          {formatData && (
            <div className="card">
              <span className="label-sm block mb-3">Your creative specs</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="block">
                  <span className="text-xs text-slate-400 block mb-1">Width (px)</span>
                  <input
                    type="number"
                    value={values.width}
                    onChange={(e) => update("width", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-slate-400 block mb-1">Height (px)</span>
                  <input
                    type="number"
                    value={values.height}
                    onChange={(e) => update("height", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-slate-400 block mb-1">File size (KB)</span>
                  <input
                    type="number"
                    value={values.fileSize}
                    onChange={(e) => update("fileSize", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-slate-400 block mb-1">File type</span>
                  <input
                    type="text"
                    placeholder="jpg"
                    value={values.fileType}
                    onChange={(e) => update("fileType", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Card 3 — Results */}
          {formatData && anyEntered && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                {failCount === 0 ? (
                  <span className="text-green-700 font-semibold text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> All checks passed
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold text-sm flex items-center gap-1.5">
                    <XCircle size={16} /> {failCount} issue{failCount > 1 ? "s" : ""} found
                  </span>
                )}
                <span className="text-xs text-slate-400">{passCount}/{totalGraded} passing</span>
              </div>

              <div className="space-y-2">
                {results.map(({ check, status, yours }) => (
                  <div
                    key={check.key}
                    className={`flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 ${
                      status === "pass"
                        ? "bg-green-50"
                        : status === "fail"
                        ? "bg-red-50"
                        : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {status === "pass" && <CheckCircle2 size={16} className="text-green-600 shrink-0" />}
                      {status === "fail" && <XCircle size={16} className="text-red-500 shrink-0" />}
                      {status === "unknown" && <AlertCircle size={16} className="text-amber-500 shrink-0" />}
                      <span className="text-sm font-medium text-slate-700">{check.label}</span>
                    </div>
                    <span className="text-xs text-slate-500 mono">
                      Required: {Array.isArray(check.required) ? check.required.join("/") : check.required}
                      {check.unit} · Yours: {yours ?? "—"}
                      {check.unit}
                    </span>
                  </div>
                ))}
              </div>

              {formatData.notes && (
                <div className="border border-dashed border-slate-300 rounded-lg px-3.5 py-3 mt-4 text-sm text-slate-500">
                  {formatData.notes}
                </div>
              )}
            </div>
          )}

          {/* Card 4 — Full spec reference */}
          {formatData && (
            <div className="card">
              <span className="label-sm block mb-3">Full spec reference — {formatData.label}</span>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {Object.entries(formatData.specs).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 rounded-lg px-3.5 py-2.5">
                    <p className="text-xs text-slate-500">{key}</p>
                    <p className="mono text-sm text-slate-800 mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
