import * as React from "react";
import { cn } from "@/lib/utils";
import { Difficulty, LinkStatus, WalkthroughStatus } from "@/types/walkthrough";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "difficulty" | "status" | "linkStatus" | "outline" | "accent";
  difficulty?: Difficulty;
  status?: WalkthroughStatus;
  linkStatus?: LinkStatus;
}

export function Badge({
  className,
  variant = "default",
  difficulty,
  status,
  linkStatus,
  children,
  ...props
}: BadgeProps) {
  let badgeStyles = "bg-[#1A1E29] text-slate-300 border-[#222735]";

  if (variant === "difficulty" && difficulty) {
    switch (difficulty) {
      case "beginner":
        badgeStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        break;
      case "intermediate":
        badgeStyles = "bg-amber-500/10 text-amber-400 border-amber-500/20";
        break;
      case "advanced":
        badgeStyles = "bg-rose-500/10 text-rose-400 border-rose-500/20";
        break;
    }
  } else if (variant === "status" && status) {
    switch (status) {
      case "verified":
        badgeStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        break;
      case "pending":
        badgeStyles = "bg-amber-500/10 text-amber-400 border-amber-500/20";
        break;
      case "rejected":
        badgeStyles = "bg-rose-500/10 text-rose-400 border-rose-500/20";
        break;
    }
  } else if (variant === "linkStatus" && linkStatus) {
    switch (linkStatus) {
      case "alive":
        badgeStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        break;
      case "dead":
        badgeStyles = "bg-rose-500/10 text-rose-400 border-rose-500/20";
        break;
    }
  } else if (variant === "accent") {
    badgeStyles = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  } else if (variant === "outline") {
    badgeStyles = "bg-transparent text-slate-400 border-[#222735]";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border",
        badgeStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
