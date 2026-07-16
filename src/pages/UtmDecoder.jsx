import { useState } from "react";
import { Link } from "react-router-dom";
import { XCircle, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";
import CopyButton from "../components/CopyButton";
import { decodeUtmUrl, paramLabel, REQUIRED_PARAMS } from "../utils/utm";

export default function UtmDecoder() {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState(null);

  function runDecode(value) {
    const v = value ?? raw;
    if (!v.trim()) {
      setResult(null);
      return;
    }
    setResult(decodeUtmUrl(v));
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text");
    // let the paste land in state, then decode on next tick
    setTimeout(() => runDecode(pasted), 0);
  }

  return (
    <>
      <SEO
        title="UTM Decoder"
        description="Paste any UTM-tagged URL to instantly decode every parameter into a clean table, plus get a stripped clean URL with one click."
        path="/utm-decoder"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">UTM Decoder</h1>
        <p className="text-slate-600 mt-2 mb-8">
          Paste a URL with UTM params — decoded in a clean table. Also strips UTMs for a clean link.
        </p>

        <div className="space-y-4">
          {/* Card 1 — Input */}
          <div className="card">
            <span className="label-sm block mb-1.5">Paste a UTM-tagged URL</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <XCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={raw}
                  onChange={(e) => {
                    setRaw(e.target.value);
                    if (!e.target.value.trim()) setResult(null);
                  }}
                  onPaste={handlePaste}
                  placeholder="https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring-sale"
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm mono focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => runDecode()}
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0"
              >
                Decode
              </button>
            </div>
            {result?.error && <p className="text-xs text-red-500 mt-2">{result.error}</p>}
          </div>

          {/* Card 2 — Results */}
          {result && result.isValid && (
            <div className="card">
              <h2 className="text-base font-semibold mb-3">UTM parameters found</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="label-sm pb-2 font-semibold">Parameter</th>
                    <th className="label-sm pb-2 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.params).map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                      <td className="py-2 px-2 mono text-slate-500 rounded-l-lg">{key}</td>
                      <td className="py-2 px-2 font-semibold text-slate-800 rounded-r-lg">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {result.missing.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-3.5 py-2.5 mt-4">
                  Missing required parameters: {result.missing.map(paramLabel).join(", ")}
                </div>
              )}
            </div>
          )}

          {result && !result.isValid && !result.error && (
            <div className="card text-sm text-slate-500">No UTM parameters found on that URL.</div>
          )}

          {/* Card 3 — Clean URL */}
          {result && result.isValid && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="label-sm">Clean URL (UTMs stripped)</span>
                <CopyButton text={result.cleanUrl} />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm mono break-all text-slate-700">
                {result.cleanUrl}
              </div>
            </div>
          )}

          {/* Cross-link */}
          <div className="text-sm text-slate-500 flex items-center gap-1.5">
            Built a URL instead?
            <Link to="/utm-builder" className="text-brand-600 font-medium hover:underline inline-flex items-center gap-0.5">
              Try the UTM Builder <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 4 — Explainer */}
          <div className="card">
            <h2 className="text-base font-semibold mb-2">What are UTM parameters?</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              UTM parameters are small tags appended to a URL — {REQUIRED_PARAMS.map(paramLabel).join(", ")}, plus
              optional Content and Term — that tell your analytics platform exactly which campaign, channel, and ad
              sent a visitor. Pasting a tagged link here breaks each one out so you can verify it was built correctly
              before it goes live.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
