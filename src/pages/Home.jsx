import { Link } from "react-router-dom";
import { Link2, ScanSearch, ClipboardCheck, Calculator, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

const TOOLS = [
  {
    to: "/utm-builder",
    icon: Link2,
    color: "bg-brand-600",
    name: "UTM Builder",
    desc: "Build campaign tracking URLs with live preview, presets, and history.",
    tags: ["Daily use", "Free"],
  },
  {
    to: "/utm-decoder",
    icon: ScanSearch,
    color: "bg-violet-600",
    name: "UTM Decoder",
    desc: "Paste any tagged URL and instantly see every parameter, decoded.",
    tags: ["No sign-up", "Free"],
  },
  {
    to: "/ad-spec-checker",
    icon: ClipboardCheck,
    color: "bg-sky-600",
    name: "Ad Spec Checker",
    desc: "Check creative dimensions and file specs against platform requirements.",
    tags: ["5 platforms", "Free"],
  },
  {
    to: "/roas-calculator",
    icon: Calculator,
    color: "bg-emerald-600",
    name: "ROAS Calculator",
    desc: "ROAS, break-even, CPM, CPC, CTR, and CPA — all from one input set.",
    tags: ["6 metrics", "Free"],
  },
];

export default function Home() {
  return (
    <>
      <SEO
        description="Free UTM builder, UTM decoder, ad spec checker, and ROAS calculator for performance marketers. No sign-up, no paywalls, all in your browser."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "adsgear.net",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: "Free UTM builder, UTM decoder, ad spec checker, and ROAS calculator for performance marketers.",
        }}
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14 text-center">
        <p className="font-mono text-xs text-brand-600 tracking-wide mb-4">adsgear.net</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 max-w-3xl mx-auto">
          Free tools for <span className="text-brand-600">performance marketers</span>
        </h1>
        <p className="text-slate-600 mt-5 max-w-xl mx-auto text-base sm:text-lg">
          UTM builders, spec checkers, ROAS calculators — everything you open ten times a week.
          No login, no paywalls.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-7">
          {["All calculations in your browser", "No sign-up required", "Free forever"].map((pill) => (
            <span
              key={pill}
              className="text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-full px-3.5 py-1.5"
            >
              {pill}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid sm:grid-cols-2 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group card hover:border-brand-200 hover:shadow-lg hover:shadow-slate-200/60 transition-all"
            >
              <div className="flex items-start justify-between">
                <span className={`w-11 h-11 rounded-xl ${tool.color} flex items-center justify-center`}>
                  <tool.icon size={20} className="text-white" />
                </span>
                <ArrowRight
                  size={18}
                  className="text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all mt-1"
                />
              </div>
              <h2 className="text-lg font-semibold mt-4 text-slate-900">{tool.name}</h2>
              <p className="text-sm text-slate-500 mt-1.5">{tool.desc}</p>
              <div className="flex gap-2 mt-4">
                {tool.tags.map((t) => (
                  <span key={t} className="text-xs font-medium bg-slate-100 text-slate-500 rounded-full px-2.5 py-1">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
