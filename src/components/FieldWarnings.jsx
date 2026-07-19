import { AlertTriangle, Wand2 } from "lucide-react";

export default function FieldWarnings({ warnings, onFix }) {
  if (!warnings.length) return null;
  return (
    <div className="mt-1.5 space-y-1">
      {warnings.map((w) => (
        <div key={w.code} className="flex items-start gap-1.5 text-xs text-amber-600">
          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
          <span className="flex-1">{w.message}</span>
          {w.fix && (
            <button
              type="button"
              onClick={() => onFix(w)}
              className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline shrink-0"
            >
              <Wand2 size={12} />
              Fix
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
