import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import SEO from "../components/SEO";
import NumberField from "../components/NumberField";
import { computeMetrics, METRIC_FORMULAS, ROAS_BENCHMARKS, forecastFromImpressions, forecastFromBudget } from "../utils/metrics";
import { useQuerySync, isNumericString, readQueryParams } from "../utils/useQuerySync";

const INPUT_KEYS = ["spend", "revenue", "clicks", "conversions", "impressions", "margin"];

function loadInitialMode() {
  const query = readQueryParams();
  const mode = query.get("mode");
  return mode === "cpc" || mode === "cpm" ? mode : "cpc";
}

function loadInitialInputs() {
  const query = readQueryParams();
  const inputs = { spend: "", revenue: "", clicks: "", conversions: "", impressions: "", margin: "" };
  INPUT_KEYS.forEach((key) => {
    const value = query.get(key);
    if (value !== null && isNumericString(value)) inputs[key] = value;
  });
  return inputs;
}

const METRIC_CARDS = [
  { key: "roas", label: "ROAS", suffix: "x", highlight: true },
  { key: "breakEvenRoas", label: "Break-even ROAS", suffix: "x" },
  { key: "cpm", label: "CPM", prefix: "$" },
  { key: "cpc", label: "CPC", prefix: "$" },
  { key: "ctr", label: "CTR", suffix: "%" },
  { key: "cpa", label: "CPA", prefix: "$" },
];

function fmt(val, { prefix = "", suffix = "" } = {}) {
  if (val === null || val === undefined || Number.isNaN(val)) return "—";
  return `${prefix}${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}${suffix}`;
}

export default function RoasCalculator() {
  const [mode, setMode] = useState(loadInitialMode);
  const [inputs, setInputs] = useState(loadInitialInputs);
  const [forecastTab, setForecastTab] = useState("toBudget");
  const [forecastInputs, setForecastInputs] = useState({ impressions: "", budget: "", cpm: "" });

  useQuerySync({ mode, ...inputs });

  function update(key, value) {
    setInputs((s) => ({ ...s, [key]: value }));
  }

  const metrics = useMemo(() => computeMetrics(mode, inputs), [mode, inputs]);

  const forecastResult = useMemo(() => {
    if (forecastTab === "toBudget") {
      return forecastFromImpressions(forecastInputs.impressions, forecastInputs.cpm);
    }
    return forecastFromBudget(forecastInputs.budget, forecastInputs.cpm);
  }, [forecastTab, forecastInputs]);

  const verdictConfig = {
    profitable: {
      bg: "bg-green-50 text-green-700 border-green-200",
      icon: TrendingUp,
      text: `${fmt(metrics.roas, { suffix: "x" })} ROAS is above your break-even of ${fmt(metrics.breakEvenRoas, { suffix: "x" })} — profitable`,
    },
    borderline: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Minus,
      text: `${fmt(metrics.roas, { suffix: "x" })} ROAS is close to your break-even of ${fmt(metrics.breakEvenRoas, { suffix: "x" })} — borderline`,
    },
    unprofitable: {
      bg: "bg-red-50 text-red-600 border-red-200",
      icon: TrendingDown,
      text: `${fmt(metrics.roas, { suffix: "x" })} ROAS is below your break-even of ${fmt(metrics.breakEvenRoas, { suffix: "x" })} — unprofitable. Reduce CPM or improve CVR before scaling.`,
    },
  };
  const verdict = metrics.verdict ? verdictConfig[metrics.verdict] : null;

  return (
    <>
      <SEO
        title="ROAS Calculator"
        description="Free campaign metrics calculator — ROAS, break-even ROAS, CPM, CPC, CTR, and CPA from one set of inputs, with a live profitability verdict."
        path="/roas-calculator"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">ROAS Calculator</h1>
        <p className="text-slate-600 mt-2 mb-8">
          Enter your campaign numbers. Calculate ROAS, break-even, CPM, CPC, CTR, and CPA.
        </p>

        <div className="space-y-4">
          {/* Card 1 — Mode toggle + inputs */}
          <div className="card">
            <div className="inline-flex rounded-lg border border-slate-200 p-1 mb-5">
              {["cpc", "cpm"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-md transition-colors ${
                    mode === m ? "bg-brand-600 text-white" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {m.toUpperCase()} mode
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <NumberField label="Spend" value={inputs.spend} onChange={(v) => update("spend", v)} step={100} prefix="$" />
              <NumberField label="Revenue" value={inputs.revenue} onChange={(v) => update("revenue", v)} step={100} prefix="$" />
              {mode === "cpm" && (
                <NumberField label="Impressions" value={inputs.impressions} onChange={(v) => update("impressions", v)} step={10} />
              )}
              <NumberField label="Clicks" value={inputs.clicks} onChange={(v) => update("clicks", v)} step={10} />
              <NumberField label="Conversions" value={inputs.conversions} onChange={(v) => update("conversions", v)} step={10} />
              <NumberField label="Gross margin" value={inputs.margin} onChange={(v) => update("margin", v)} step={1} suffix="%" />
            </div>
          </div>

          {/* Card 2 — Verdict */}
          {verdict && (
            <div className={`border rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm font-medium ${verdict.bg}`}>
              <verdict.icon size={17} className="shrink-0" />
              {verdict.text}
            </div>
          )}

          {/* Card 3 — Metric results grid */}
          <div className="grid sm:grid-cols-3 gap-3">
            {METRIC_CARDS.map((m) => (
              <div
                key={m.key}
                className={`card ${m.highlight ? "border-brand-200 bg-brand-50/40" : ""}`}
              >
                <p className="label-sm">{m.label}</p>
                <p className={`text-2xl font-bold mt-1.5 ${m.highlight ? "text-brand-700" : "text-slate-800"} ${
                  metrics[m.key] === null ? "text-slate-300" : ""
                }`}>
                  {fmt(metrics[m.key], m)}
                </p>
                <p className="mono text-[11px] text-slate-400 mt-2">{METRIC_FORMULAS[m.key]}</p>
              </div>
            ))}
          </div>

          {/* Card 4 — ROAS benchmark table */}
          <div className="card">
            <h2 className="text-base font-semibold mb-3">ROAS benchmarks by platform</h2>
            <table className="w-full text-sm">
              <tbody>
                {ROAS_BENCHMARKS.map((b, i) => (
                  <tr key={b.platform} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                    <td className="py-2 px-2.5 rounded-l-lg text-slate-600">{b.platform}</td>
                    <td className="py-2 px-2.5 rounded-r-lg mono font-medium text-slate-800 text-right">{b.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-slate-400 mt-3">
              Benchmarks vary by industry and margin. Use as a directional guide only.
            </p>
          </div>

          {/* Card 5 — Budget forecaster */}
          <div className="card">
            <h2 className="text-base font-semibold mb-3">Budget forecaster</h2>
            <div className="inline-flex rounded-lg border border-slate-200 p-1 mb-5 text-xs">
              <button
                type="button"
                onClick={() => setForecastTab("toBudget")}
                className={`font-medium px-3 py-1.5 rounded-md transition-colors ${
                  forecastTab === "toBudget" ? "bg-brand-600 text-white" : "text-slate-500"
                }`}
              >
                How much budget do I need?
              </button>
              <button
                type="button"
                onClick={() => setForecastTab("toResults")}
                className={`font-medium px-3 py-1.5 rounded-md transition-colors ${
                  forecastTab === "toResults" ? "bg-brand-600 text-white" : "text-slate-500"
                }`}
              >
                What will I get for my budget?
              </button>
            </div>

            {forecastTab === "toBudget" ? (
              <div className="grid sm:grid-cols-3 gap-4">
                <NumberField
                  label="Target impressions"
                  value={forecastInputs.impressions}
                  onChange={(v) => setForecastInputs((s) => ({ ...s, impressions: v }))}
                  step={10}
                />
                <NumberField
                  label="CPM"
                  value={forecastInputs.cpm}
                  onChange={(v) => setForecastInputs((s) => ({ ...s, cpm: v }))}
                  step={0.5}
                  prefix="$"
                />
                <div className="bg-slate-50 rounded-lg px-3.5 py-2.5">
                  <p className="text-xs text-slate-500">Required budget</p>
                  <p className="text-lg font-semibold text-slate-800 mt-0.5">
                    {forecastResult ? fmt(forecastResult.budget, { prefix: "$" }) : "—"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    ~{forecastResult ? fmt(forecastResult.clicks) : "—"} est. clicks
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                <NumberField
                  label="Budget"
                  value={forecastInputs.budget}
                  onChange={(v) => setForecastInputs((s) => ({ ...s, budget: v }))}
                  step={100}
                  prefix="$"
                />
                <NumberField
                  label="CPM"
                  value={forecastInputs.cpm}
                  onChange={(v) => setForecastInputs((s) => ({ ...s, cpm: v }))}
                  step={0.5}
                  prefix="$"
                />
                <div className="bg-slate-50 rounded-lg px-3.5 py-2.5">
                  <p className="text-xs text-slate-500">Est. impressions</p>
                  <p className="text-lg font-semibold text-slate-800 mt-0.5">
                    {forecastResult ? fmt(forecastResult.impressions) : "—"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    ~{forecastResult ? fmt(forecastResult.clicks) : "—"} clicks · ~
                    {forecastResult ? fmt(forecastResult.conversions) : "—"} conversions
                  </p>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-3">
              Forecasts assume a 1.5% CTR and 5% conversion rate unless your own campaign data suggests otherwise.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
