import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/utm-builder", label: "UTM Builder" },
  { to: "/utm-decoder", label: "UTM Decoder" },
  { to: "/ad-spec-checker", label: "Spec Checker" },
  { to: "/roas-calculator", label: "ROAS Calc" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
            <span className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={18} className="text-white" fill="white" />
            </span>
            <span className="font-semibold text-lg tracking-tight">
              AdGear
              <span className="font-mono text-slate-400 font-normal">.net</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "text-brand-600 bg-brand-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="md:hidden p-2 -mr-2 text-slate-600"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-2 py-3 text-sm font-medium border-b border-slate-100 last:border-0 ${
                    isActive ? "text-brand-600" : "text-slate-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
