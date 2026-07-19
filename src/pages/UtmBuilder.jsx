import { useState, useEffect, useMemo } from "react";
import { Link2, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import SEO from "../components/SEO";
import CopyButton from "../components/CopyButton";
import FieldWarnings from "../components/FieldWarnings";
import {
  buildUtmUrl,
  paramLabel,
  ALL_PARAMS,
  SOURCE_PRESETS,
  MEDIUM_PRESETS,
  getHistory,
  pushHistory,
  clearHistory,
} from "../utils/utm";
import { lintUtmValue, getParamHistory, addParamHistoryValue } from "../utils/utmLint";
import { useQuerySync, isValidUrlLike, readQueryParams } from "../utils/useQuerySync";

// Maps shareable query param names to internal state keys
const QUERY_PARAM_MAP = {
  url: "baseUrl",
  source: "utm_source",
  medium: "utm_medium",
  campaign: "utm_campaign",
  term: "utm_term",
  content: "utm_content",
};

const STORAGE_KEY = "adsgear_utm_builder_state";

function loadInitial() {
  let state = { baseUrl: "", utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "", utm_term: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch {
    /* noop */
  }

  const query = readQueryParams();
  Object.entries(QUERY_PARAM_MAP).forEach(([param, key]) => {
    const value = query.get(param);
    if (value === null || !value.trim()) return;
    if (key === "baseUrl" && !isValidUrlLike(value)) return;
    state = { ...state, [key]: value };
  });

  return state;
}

export default function UtmBuilder() {
  const [state, setState] = useState(loadInitial);
  const [generated, setGenerated] = useState(null);
  const [history, setHistory] = useState(getHistory);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [paramHistory, setParamHistory] = useState(() => {
    const h = {};
    ALL_PARAMS.forEach((k) => {
      h[k] = getParamHistory(k);
    });
    return h;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state]);

  useQuerySync({
    url: state.baseUrl,
    source: state.utm_source,
    medium: state.utm_medium,
    campaign: state.utm_campaign,
    term: state.utm_term,
    content: state.utm_content,
  });

  const live = useMemo(() => buildUtmUrl(state.baseUrl, state), [state]);

  const warnings = useMemo(() => {
    const w = {};
    ALL_PARAMS.forEach((k) => {
      w[k] = lintUtmValue(k, state[k], paramHistory[k]);
    });
    return w;
  }, [state, paramHistory]);

  function update(key, value) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function applyFix(w) {
    update(w.param, w.fix(state[w.param]));
  }

  function handleGenerate() {
    const result = buildUtmUrl(state.baseUrl, state);
    setGenerated(result);
    if (result.url) {
      setHistory(pushHistory(result.url));
      ALL_PARAMS.forEach((key) => addParamHistoryValue(key, state[key]));
      const h = {};
      ALL_PARAMS.forEach((k) => {
        h[k] = getParamHistory(k);
      });
      setParamHistory(h);
    }
  }

  function handleReset() {
    setState({ baseUrl: "", utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "", utm_term: "" });
    setGenerated(null);
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  function handleLoad(url) {
    try {
      const u = new URL(url);
      setState({
        baseUrl: `${u.origin}${u.pathname}`,
        utm_source: u.searchParams.get("utm_source") || "",
        utm_medium: u.searchParams.get("utm_medium") || "",
        utm_campaign: u.searchParams.get("utm_campaign") || "",
        utm_content: u.searchParams.get("utm_content") || "",
        utm_term: u.searchParams.get("utm_term") || "",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      /* noop */
    }
  }

  // renders base URL in grey, utm params highlighted in brand color
  function renderUrlParts(url) {
    if (!url) return null;
    const [base, query] = url.split("?");
    if (!query) return <span className="text-slate-500">{base}</span>;
    return (
      <>
        <span className="text-slate-500">{base}?</span>
        {query.split("&").map((pair, i) => (
          <span key={i}>
            {i > 0 && <span className="text-slate-400">&amp;</span>}
            <span className="text-brand-600">{pair}</span>
          </span>
        ))}
      </>
    );
  }

  return (
    <>
      <SEO
        title="UTM Builder"
        description="Build UTM tracking URLs with live preview, source and medium presets, and a saved history of your last 20 links."
        path="/utm-builder"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">UTM Builder</h1>
        <p className="text-slate-600 mt-2 mb-8">
          Build campaign tracking URLs. Quick-fill presets. History saved in your browser.
        </p>

        <div className="space-y-4">
          {/* Card 1 — Destination URL */}
          <div className="card">
            <span className="label-sm block mb-1.5">Destination URL *</span>
            <div className="relative">
              <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={state.baseUrl}
                onChange={(e) => update("baseUrl", e.target.value)}
                placeholder="https://example.com/landing-page"
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-10 text-sm mono focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
              />
              <button
                type="button"
                onClick={() => update("baseUrl", "")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500"
                aria-label="Clear destination URL"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Card 2 — Campaign parameters */}
          <div className="card">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block">
                  <span className="label-sm block mb-1.5">Source *</span>
                  <input
                    type="text"
                    value={state.utm_source}
                    onChange={(e) => update("utm_source", e.target.value)}
                    placeholder="google"
                    className={`w-full rounded-lg border py-2.5 px-3 text-sm focus:ring-1 outline-none ${
                      generated && generated.missing.includes("utm_source")
                        ? "border-red-300 focus:border-red-400 focus:ring-red-300"
                        : "border-slate-200 focus:border-brand-600 focus:ring-brand-600"
                    }`}
                  />
                </label>
                {generated?.missing.includes("utm_source") && (
                  <p className="text-xs text-red-500 mt-1">Source is required</p>
                )}
                <FieldWarnings warnings={warnings.utm_source} onFix={applyFix} />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SOURCE_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update("utm_source", p)}
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
                    value={state.utm_medium}
                    onChange={(e) => update("utm_medium", e.target.value)}
                    placeholder="cpc"
                    className={`w-full rounded-lg border py-2.5 px-3 text-sm focus:ring-1 outline-none ${
                      generated && generated.missing.includes("utm_medium")
                        ? "border-red-300 focus:border-red-400 focus:ring-red-300"
                        : "border-slate-200 focus:border-brand-600 focus:ring-brand-600"
                    }`}
                  />
                </label>
                {generated?.missing.includes("utm_medium") && (
                  <p className="text-xs text-red-500 mt-1">Medium is required</p>
                )}
                <FieldWarnings warnings={warnings.utm_medium} onFix={applyFix} />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {MEDIUM_PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update("utm_medium", p)}
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
                  value={state.utm_campaign}
                  onChange={(e) => update("utm_campaign", e.target.value)}
                  placeholder="spring-launch-2026"
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                />
                <FieldWarnings warnings={warnings.utm_campaign} onFix={applyFix} />
              </label>

              <label className="block">
                <span className="label-sm block mb-1.5">Content</span>
                <input
                  type="text"
                  value={state.utm_content}
                  onChange={(e) => update("utm_content", e.target.value)}
                  placeholder="carousel-ad-1"
                  className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                />
                <FieldWarnings warnings={warnings.utm_content} onFix={applyFix} />
              </label>

              <label className="block sm:col-span-2">
                <span className="label-sm block mb-1.5">Term (optional)</span>
                <input
                  type="text"
                  value={state.utm_term}
                  onChange={(e) => update("utm_term", e.target.value)}
                  placeholder="running-shoes"
                  className="w-full sm:w-1/2 rounded-lg border border-slate-200 py-2.5 px-3 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                />
                <FieldWarnings warnings={warnings.utm_term} onFix={applyFix} />
              </label>
            </div>

            <p className="text-xs text-slate-400 mt-5 leading-relaxed">
              Tip: keep values lowercase and use hyphens instead of spaces — <span className="mono">spring-sale</span> not{" "}
              <span className="mono">Spring Sale</span>. Consistent values keep your reports from splitting into duplicates.
            </p>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={!state.baseUrl.trim()}
              className="mt-5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Generate URL
            </button>
          </div>

          {/* Card 3 — Generated URL */}
          {generated && generated.hasBase && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="label-sm">Generated URL</span>
                <CopyButton text={generated.url} />
              </div>

              {generated.missing.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-3.5 py-2.5 mb-3">
                  Missing required: {generated.missing.map(paramLabel).join(", ")}. URL was still generated below.
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm mono break-all leading-relaxed">
                {renderUrlParts(generated.url)}
              </div>

              <table className="w-full mt-4 text-sm">
                <tbody>
                  {["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
                    .filter((k) => state[k]?.trim())
                    .map((k) => (
                      <tr key={k} className="border-t border-slate-100 first:border-0">
                        <td className="py-2 pr-4 text-slate-500 w-28">{paramLabel(k)}</td>
                        <td className="py-2 mono text-slate-700">{state[k]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Card 4 — History */}
          <div className="card">
            <button
              type="button"
              onClick={() => setHistoryOpen((o) => !o)}
              className="flex items-center justify-between w-full"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Clock size={15} className="text-slate-400" />
                Recent ({history.length})
              </span>
              {historyOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>

            {historyOpen && (
              <div className="mt-4">
                {history.length > 0 && (
                  <div className="flex justify-end mb-2">
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="text-xs text-slate-400 hover:text-red-500"
                    >
                      Clear history
                    </button>
                  </div>
                )}
                {history.length === 0 ? (
                  <p className="text-sm text-slate-400">No URLs generated yet. Your last 20 will show up here.</p>
                ) : (
                  <ul className="space-y-2">
                    {history.map((h) => (
                      <li
                        key={h.ts}
                        className="flex items-center justify-between gap-3 border border-slate-100 rounded-lg px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="mono text-xs text-slate-600 truncate">{h.url}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(h.ts).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleLoad(h.url)}
                            className="text-xs font-medium text-brand-600 hover:underline"
                          >
                            Load
                          </button>
                          <CopyButton text={h.url} label="" className="!px-2" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
