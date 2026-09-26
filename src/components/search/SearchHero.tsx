"use client";

import * as React from "react";
import { Search, Command, Sparkles, Terminal } from "lucide-react";
import { Category } from "@/types/walkthrough";

interface SearchHeroProps {
  query: string;
  onQueryChange: (query: string) => void;
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  selectedPlatform: string | null;
  onSelectPlatform: (platform: string | null) => void;
}

export function SearchHero({
  query,
  onQueryChange,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPlatform,
  onSelectPlatform,
}: SearchHeroProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const popularChips = [
    { label: "Active Directory", type: "category" as const },
    { label: "HackTheBox", type: "platform" as const, val: "hackthebox" },
    { label: "TryHackMe", type: "platform" as const, val: "tryhackme" },
    { label: "Buffer Overflow", type: "category" as const },
    { label: "Web Exploitation", type: "category" as const },
    { label: "Privilege Escalation", type: "category" as const },
  ];

  return (
    <div className="relative pt-10 pb-8 text-center space-y-6 max-w-3xl mx-auto">
      {/* Decorative accent pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Curated & Preserved CTF Knowledge Base</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">
          Search Security Writeups
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          High-yield walkthroughs, exploit chains, and machine writeups with guaranteed Wayback Machine snapshot preservation.
        </p>
      </div>

      {/* Omni-search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-500 pointer-events-none flex items-center">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by target, CVE, tool, vulnerability, or machine name..."
            className="w-full bg-[#14171F] text-slate-100 placeholder:text-slate-500 text-sm sm:text-base rounded-xl border border-[#222735] hover:border-[#2E3547] pl-12 pr-20 py-3.5 shadow-xl transition-all focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20"
          />
          <div className="absolute right-3.5 flex items-center gap-1 text-[11px] text-slate-400 font-mono bg-[#1A1E29] border border-[#222735] px-2 py-1 rounded pointer-events-none select-none">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Quick Tag Chips */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-1 text-xs">
        <span className="text-slate-500 text-[11px] font-mono mr-1">Quick Filters:</span>
        {popularChips.map((chip, idx) => {
          let isSelected = false;
          if (chip.type === "platform" && chip.val) {
            isSelected = selectedPlatform === chip.val;
          } else {
            const foundCat = categories.find(
              (c) => c.name.toLowerCase() === chip.label.toLowerCase()
            );
            isSelected = Boolean(foundCat && selectedCategory === foundCat.id);
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (chip.type === "platform" && chip.val) {
                  onSelectPlatform(isSelected ? null : chip.val);
                } else {
                  const cat = categories.find(
                    (c) => c.name.toLowerCase() === chip.label.toLowerCase()
                  );
                  if (cat) {
                    onSelectCategory(isSelected ? null : cat.id);
                  } else {
                    onQueryChange(chip.label);
                  }
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                isSelected
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : "bg-[#14171F] hover:bg-[#1A1E29] text-slate-400 hover:text-slate-200 border-[#222735]"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
