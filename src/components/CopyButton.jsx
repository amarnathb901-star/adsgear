import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text, label = "Copy", className = "" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        copied
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-white border-slate-200 text-slate-600 hover:border-brand-200 hover:text-brand-600"
      } ${className}`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : label}
    </button>
  );
}
