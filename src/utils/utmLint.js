// UTM naming-convention linter — shared by UTM Builder and Bulk Generator.

import { paramLabel } from "./utm";

const PARAM_HISTORY_KEY = "adsgear_utm_param_history";

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function isSubsequence(shorter, longer) {
  let i = 0;
  for (let j = 0; j < longer.length && i < shorter.length; j++) {
    if (shorter[i] === longer[j]) i++;
  }
  return i === shorter.length;
}

// True when two normalized values look like the "same" thing spelled differently
// (abbreviation or typo) rather than simply a case/space difference (handled separately)
// or two genuinely unrelated values.
function isNearMatch(a, b) {
  if (!a || !b || a === b) return false;
  const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
  if (shorter.length < 2) return false;

  if (shorter.length <= Math.ceil(longer.length * 0.6) && isSubsequence(shorter, longer)) {
    return true;
  }

  if (longer.length <= 3) return false;
  const distance = levenshtein(a, b);
  return distance <= 2 && distance / longer.length <= 0.4;
}

function readAllHistory() {
  try {
    const raw = localStorage.getItem(PARAM_HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getParamHistory(paramKey) {
  return readAllHistory()[paramKey] || [];
}

export function addParamHistoryValue(paramKey, value) {
  const trimmed = value?.trim();
  if (!trimmed) return;
  try {
    const all = readAllHistory();
    const list = all[paramKey] || [];
    if (!list.includes(trimmed)) {
      all[paramKey] = [...list, trimmed];
      localStorage.setItem(PARAM_HISTORY_KEY, JSON.stringify(all));
    }
  } catch {
    /* noop */
  }
}

// Returns an array of warnings for a single param value: { code, param, message, fix }.
// fix is null for warnings that shouldn't offer an auto-fix (semantic mismatches).
export function lintUtmValue(paramKey, rawValue, historyValues = getParamHistory(paramKey)) {
  const warnings = [];
  const value = rawValue ?? "";
  if (!value.trim()) return warnings;

  if (/\s/.test(value)) {
    warnings.push({
      code: "spaces",
      param: paramKey,
      message: "Spaces should be hyphens",
      fix: (v) => v.replace(/\s+/g, "-"),
    });
  }

  if (/[A-Z]/.test(value)) {
    warnings.push({
      code: "uppercase",
      param: paramKey,
      message: "Should be lowercase",
      fix: (v) => v.toLowerCase(),
    });
  }

  const normalizedCurrent = normalize(value);
  const hasExactHistoryMatch = historyValues.some((h) => normalize(h) === normalizedCurrent);

  if (!hasExactHistoryMatch) {
    const nearMatch = historyValues.find((h) => isNearMatch(normalizedCurrent, normalize(h)));
    if (nearMatch) {
      warnings.push({
        code: "mismatch",
        param: paramKey,
        message: `You previously used "${nearMatch}" for ${paramLabel(paramKey).toLowerCase()} — is this intentional?`,
        fix: null,
      });
    }
  }

  return warnings;
}
