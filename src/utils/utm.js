// UTM Builder / Decoder shared logic

export const REQUIRED_PARAMS = ["utm_source", "utm_medium", "utm_campaign"];
export const ALL_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

export const SOURCE_PRESETS = ["google", "facebook", "instagram", "linkedin", "email", "youtube", "twitter"];
export const MEDIUM_PRESETS = ["cpc", "cpm", "email", "social", "organic", "display"];

const PARAM_LABELS = {
  utm_source: "Source",
  utm_medium: "Medium",
  utm_campaign: "Campaign",
  utm_content: "Content",
  utm_term: "Term",
};

export function paramLabel(key) {
  return PARAM_LABELS[key] || key;
}

// Build a UTM-tagged URL from a base URL + param map. Returns { url, isValid, missing }
export function buildUtmUrl(baseUrl, params) {
  const missing = REQUIRED_PARAMS.filter((p) => !params[p]?.trim());
  if (!baseUrl?.trim()) {
    return { url: "", isValid: false, missing, hasBase: false };
  }

  let url;
  try {
    // allow bare domains without protocol
    const normalized = /^https?:\/\//i.test(baseUrl) ? baseUrl : `https://${baseUrl}`;
    url = new URL(normalized);
  } catch {
    return { url: "", isValid: false, missing, hasBase: false, error: "Enter a valid URL" };
  }

  ALL_PARAMS.forEach((key) => {
    const val = params[key]?.trim();
    if (val) {
      url.searchParams.set(key, val);
    } else {
      url.searchParams.delete(key);
    }
  });

  return {
    url: url.toString(),
    isValid: missing.length === 0,
    missing,
    hasBase: true,
  };
}

// Decode a pasted URL. Returns { params: {key:value}, missing, cleanUrl, isValid, error }
export function decodeUtmUrl(rawUrl) {
  if (!rawUrl?.trim()) {
    return { params: {}, missing: [], cleanUrl: "", isValid: false };
  }
  let url;
  try {
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    url = new URL(normalized);
  } catch {
    return { params: {}, missing: [], cleanUrl: "", isValid: false, error: "That doesn't look like a valid URL" };
  }

  const params = {};
  ALL_PARAMS.forEach((key) => {
    const v = url.searchParams.get(key);
    if (v) params[key] = v;
  });

  const missing = REQUIRED_PARAMS.filter((p) => !params[p]);

  const cleanUrl = new URL(url.toString());
  ALL_PARAMS.forEach((key) => cleanUrl.searchParams.delete(key));

  return {
    params,
    missing,
    cleanUrl: cleanUrl.toString(),
    isValid: Object.keys(params).length > 0,
  };
}

// localStorage history helpers
const HISTORY_KEY = "adsgear_utm_history";
const HISTORY_LIMIT = 20;

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushHistory(url) {
  try {
    const existing = getHistory().filter((h) => h.url !== url);
    const next = [{ url, ts: Date.now() }, ...existing].slice(0, HISTORY_LIMIT);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    return next;
  } catch {
    return getHistory();
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* noop */
  }
}
