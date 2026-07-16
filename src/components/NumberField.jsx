export default function NumberField({ label, value, onChange, step = 1, prefix, suffix, placeholder = "0" }) {
  return (
    <label className="block">
      <span className="label-sm block mb-1.5">{label}</span>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{prefix}</span>
        )}
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-8" : "pr-3"}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{suffix}</span>
        )}
      </div>
    </label>
  );
}
