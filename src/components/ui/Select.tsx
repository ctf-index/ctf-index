import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full bg-[#0F1218] text-slate-100 text-sm rounded-md border border-[#222735] px-3 py-2 pr-8 appearance-none transition-colors",
              "focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30",
              "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
              error && "border-rose-500/80",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#14171F] text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
