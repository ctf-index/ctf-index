import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-[#0F1218] text-slate-100 text-sm placeholder:text-slate-500 rounded-md border border-[#222735] px-3 py-2 transition-colors",
            "focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30",
            "disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[90px]",
            error && "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
