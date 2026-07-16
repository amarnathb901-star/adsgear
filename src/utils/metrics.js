// Campaign Metrics Calculator — pure calculation logic

export function computeMetrics(mode, inputs) {
  const spend = toNum(inputs.spend);
  const revenue = toNum(inputs.revenue);
  const clicks = toNum(inputs.clicks);
  const conversions = toNum(inputs.conversions);
  const impressions = mode === "cpm" ? toNum(inputs.impressions) : null;
  const marginPct = toNum(inputs.margin);

  const roas = spend > 0 && revenue != null ? revenue / spend : null;
  const breakEvenRoas = marginPct > 0 ? 1 / (marginPct / 100) : null;
  const cpm = impressions > 0 && spend != null ? (spend / impressions) * 1000 : null;
  const cpc = clicks > 0 && spend != null ? spend / clicks : null;
  const ctr = impressions > 0 && clicks != null ? (clicks / impressions) * 100 : null;
  const cpa = conversions > 0 && spend != null ? spend / conversions : null;

  let verdict = null;
  if (roas != null && breakEvenRoas != null) {
    const ratio = roas / breakEvenRoas;
    if (ratio >= 1.15) verdict = "profitable";
    else if (ratio >= 0.9) verdict = "borderline";
    else verdict = "unprofitable";
  }

  return {
    roas,
    breakEvenRoas,
    cpm,
    cpc,
    ctr,
    cpa,
    verdict,
  };
}

function toNum(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export const METRIC_FORMULAS = {
  roas: "Revenue ÷ Spend",
  breakEvenRoas: "1 ÷ Gross margin",
  cpm: "(Spend ÷ Impressions) × 1000",
  cpc: "Spend ÷ Clicks",
  ctr: "(Clicks ÷ Impressions) × 100",
  cpa: "Spend ÷ Conversions",
};

export const ROAS_BENCHMARKS = [
  { platform: "Google Search", range: "6–8x" },
  { platform: "Meta", range: "3–5x" },
  { platform: "LinkedIn", range: "2–4x" },
  { platform: "YouTube", range: "2–5x" },
  { platform: "Display", range: "1–3x" },
  { platform: "TikTok", range: "2–4x" },
];

// Budget forecaster
export function forecastFromImpressions(targetImpressions, cpm, estCtr = 1.5) {
  const imp = toNum(targetImpressions);
  const cpmVal = toNum(cpm);
  if (!imp || !cpmVal) return null;
  const budget = (imp / 1000) * cpmVal;
  const clicks = imp * (estCtr / 100);
  return { budget, clicks };
}

export function forecastFromBudget(budget, cpm, estCtr = 1.5, estCvr = 5) {
  const b = toNum(budget);
  const cpmVal = toNum(cpm);
  if (!b || !cpmVal) return null;
  const impressions = (b / cpmVal) * 1000;
  const clicks = impressions * (estCtr / 100);
  const conversions = clicks * (estCvr / 100);
  return { impressions, clicks, conversions };
}
