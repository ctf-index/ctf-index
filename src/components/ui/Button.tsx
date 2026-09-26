import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 select-none focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-emerald-500/40 active:bg-emerald-700",
      secondary:
        "bg-[#14171F] hover:bg-[#1A1E29] text-slate-200 border border-[#222735] hover:border-[#2E3547] active:bg-[#111319]",
      outline:
        "bg-transparent hover:bg-[#14171F] text-slate-300 border border-[#222735] hover:border-[#353D52]",
      danger:
        "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 active:bg-rose-500/30",
      ghost:
        "bg-transparent hover:bg-[#14171F] text-slate-400 hover:text-slate-200",
    };

    const sizes = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5",
      md: "text-sm px-3.5 py-2 gap-2",
      lg: "text-base px-4 py-2.5 gap-2.5",
      icon: "p-2 w-9 h-9 justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
