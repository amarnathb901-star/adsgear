// Minimal GA4 wrapper. Replace GA_MEASUREMENT_ID with the real ID from
// Google Analytics before deploying (Admin > Data Streams > Web).
export const GA_MEASUREMENT_ID = "G-0WJBVL7Q0Y";

export function initAnalytics() {
  if (typeof window === "undefined" || GA_MEASUREMENT_ID.includes("XXXX")) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=G-0WJBVL7Q0Y`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageview(path) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", { page_path: path });
}
