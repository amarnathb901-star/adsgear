import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const TOOL_LINKS = [
  { to: "/utm-builder", label: "UTM Builder" },
  { to: "/utm-decoder", label: "UTM Decoder" },
  { to: "/bulk-utm-generator", label: "Bulk Generator" },
  { to: "/ad-spec-checker", label: "Spec Checker" },
  { to: "/roas-calculator", label: "ROAS Calculator" },
];

const SITE_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
  { to: "/blog", label: "Blog" },
  { to: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <Zap size={14} className="text-white" fill="white" />
              </span>
              <span className="font-semibold">
                AdsGear<span className="font-mono text-slate-400 font-normal">.net</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 mt-3">free tools for performance marketers</p>
          </div>

          <div>
            <p className="label-sm mb-3">Tools</p>
            <ul className="space-y-2">
              {TOOL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-600 hover:text-brand-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-sm mb-3">Site</p>
            <ul className="space-y-2">
              {SITE_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-slate-600 hover:text-brand-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-400">
          <p>© {year} The Ad-Toolkit Team. All rights reserved.</p>
          <Link to="/contact" className="hover:text-brand-600">
            Send feedback
          </Link>
        </div>
      </div>
    </footer>
  );
}
