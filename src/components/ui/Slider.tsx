import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  onChange: (value: number) => void;
}

export function Slider({
  value,
  min = 1,
  max = 10,
  step = 1,
  label = "Quality Score",
  onChange,
  className,
  disabled,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 5) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Exceptional";
    if (score >= 7) return "High Quality";
    if (score >= 5) return "Acceptable";
    if (score >= 3) return "Low Detail";
    return "Poor";
  };

  return (
    <div className={cn("space-y-2 w-full", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">{getScoreLabel(value)}</span>
          <span
            className={cn(
              "font-mono font-semibold px-2 py-0.5 rounded border text-xs",
              getScoreColor(value)
            )}
          >
            {value} / {max}
          </span>
        </div>
      </div>

      <div className="relative flex items-center w-full h-5">
        <div className="absolute w-full h-1.5 bg-[#1A1E29] rounded-full overflow-hidden border border-[#222735]">
          <div
            className="h-full bg-emerald-500 transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-1.5 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>{min} (Minimal)</span>
        <span>5 (Average)</span>
        <span>{max} (Comprehensive)</span>
      </div>
    </div>
  );
}
