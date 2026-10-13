import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SEO from "../components/SEO";

const FAQS = [
  {
    q: "Is AdsGear really free?",
    a: "Yes. All four tools — UTM Builder, UTM Decoder, Ad Spec Checker, and ROAS Calculator — are free with no account, no login, and no usage limits.",
  },
  {
    q: "Do you store the URLs or numbers I enter?",
    a: "No. Every calculation runs in your browser. The only thing saved is your UTM Builder history, which is stored in your browser's localStorage and never sent to a server.",
  },
  {
    q: "What's the difference between the UTM Builder and UTM Decoder?",
    a: "The Builder creates a new tagged URL from a destination link and campaign parameters. The Decoder does the reverse — paste an existing tagged URL and it breaks every parameter out into a readable table.",
  },
  {
    q: "Which platforms does the Ad Spec Checker cover?",
    a: "Meta, Google, LinkedIn, YouTube, and DV360, across their most common ad formats. We update the spec data as platforms change their requirements.",
  },
  {
    q: "How is break-even ROAS calculated?",
    a: "Break-even ROAS is 1 divided by your gross margin (as a decimal). A 25% margin means you need at least a 4x ROAS just to cover costs — anything above that is where profit starts.",
  },
  {
    q: "Can I use this on mobile?",
    a: "Yes, all tools work on mobile browsers, though the desktop layout gives you a bit more room for side-by-side inputs and results.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account is required for any tool on AdsGear.",
  },
  {
    q: "How often are the ad spec requirements updated?",
    a: "We review and update platform specs a few times a year as Meta, Google, LinkedIn, YouTube, and DV360 change their requirements. If you spot something outdated, let us know through the Contact page.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <SEO
        title="FAQ"
        description="Frequently asked questions about AdsGear's free UTM builder, UTM decoder, ad spec checker, and ROAS calculator."
        path="/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-bold tracking-tight">Frequently asked questions</h1>
        <div className="mt-8 space-y-2">
          {FAQS.map((f, i) => (
            <div key={f.q} className="card !py-3">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex items-center justify-between text-left py-1.5"
              >
                <span className="font-medium text-sm sm:text-base text-slate-800 pr-4">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === i && (
                <p className="text-sm text-slate-600 leading-relaxed pt-2 pb-1.5">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
