// Debounced sync of live form state to the URL query string via history.replaceState.
// Prefilling from the query string on load is handled by each page's own initial-state
// loader (so the merged state is ready on first render, with no extra effect/rewrite).

import { useEffect, useRef } from "react";

const DEBOUNCE_MS = 400;

// params: plain object of { queryParamName: currentValue }. Empty/nullish values
// remove that param from the URL. Params not present in this object are left alone.
export function useQuerySync(params) {
  const isFirstRun = useRef(true);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const depsKey = JSON.stringify(params);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      const search = new URLSearchParams(window.location.search);
      Object.entries(paramsRef.current).forEach(([key, value]) => {
        const str = value === null || value === undefined ? "" : String(value).trim();
        if (str) search.set(key, str);
        else search.delete(key);
      });
      const query = search.toString();
      const newUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
      window.history.replaceState(null, "", newUrl);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey]);
}

export function isValidUrlLike(value) {
  if (!value?.trim()) return false;
  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}

export function isNumericString(value) {
  if (value === null || value === undefined) return false;
  const trimmed = String(value).trim();
  if (!trimmed) return false;
  return Number.isFinite(Number(trimmed));
}

export function readQueryParams() {
  return new URLSearchParams(window.location.search);
}
