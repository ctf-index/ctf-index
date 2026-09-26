import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, leftIcon, rightElement, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-slate-500 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-[#0F1218] text-slate-100 text-sm placeholder:text-slate-500 rounded-md border border-[#222735] px-3 py-2 transition-colors",
              "focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-9",
              rightElement && "pr-10",
              error && "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2.5 flex items-center text-slate-500">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
