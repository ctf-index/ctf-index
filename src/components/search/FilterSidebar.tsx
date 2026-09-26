"use client";

import { Category, Difficulty } from "@/types/walkthrough";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Filter, RotateCcw, ShieldCheck } from "lucide-react";

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  selectedPlatform: string | null;
  onSelectPlatform: (platform: string | null) => void;
  selectedDifficulty: Difficulty | null;
  onSelectDifficulty: (difficulty: Difficulty | null) => void;
  minQuality: number;
  onMinQualityChange: (score: number) => void;
  pocOnly: boolean;
  onPocOnlyChange: (enabled: boolean) => void;
  onReset: () => void;
}

const PLATFORMS = [
  { id: "hackthebox", label: "Hack The Box" },
  { id: "tryhackme", label: "TryHackMe" },
  { id: "vulnhub", label: "VulnHub" },
  { id: "portswigger", label: "PortSwigger" },
  { id: "ctftime", label: "CTFtime" },
  { id: "picoctf", label: "PicoCTF" },
];

export function FilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPlatform,
  onSelectPlatform,
  selectedDifficulty,
  onSelectDifficulty,
  minQuality,
  onMinQualityChange,
  pocOnly,
  onPocOnlyChange,
  onReset,
}: FilterSidebarProps) {
  const hasActiveFilters = Boolean(
    selectedCategory || selectedPlatform || selectedDifficulty || minQuality > 1 || pocOnly
  );

  return (
    <div className="bg-[#14171F] border border-[#222735] rounded-lg p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#222735]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
            Facet Filters
          </h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Platform Facet */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-300">CTF Platform</label>
        <div className="grid grid-cols-2 gap-1.5">
          {PLATFORMS.map((plat) => {
            const isSelected = selectedPlatform === plat.id;
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => onSelectPlatform(isSelected ? null : plat.id)}
                className={`text-xs px-2.5 py-1.5 rounded text-left border transition-colors ${
                  isSelected
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-medium"
                    : "bg-[#0F1218] text-slate-400 hover:text-slate-200 border-[#222735]"
                }`}
              >
                {plat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Facet */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-300">Difficulty Level</label>
        <div className="grid grid-cols-3 gap-1.5">
          {(["beginner", "intermediate", "advanced"] as Difficulty[]).map((tier) => {
            const isSelected = selectedDifficulty === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => onSelectDifficulty(isSelected ? null : tier)}
                className={`text-xs py-1.5 rounded capitalize border transition-all text-center ${
                  isSelected
                    ? tier === "beginner"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-medium"
                      : tier === "intermediate"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50 font-medium"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/50 font-medium"
                    : "bg-[#0F1218] text-slate-400 hover:text-slate-200 border-[#222735]"
                }`}
              >
                {tier}
              </button>
            );
          })}
        </div>
      </div>

      {/* PoC Toggle */}
      <div className="bg-[#0F1218] border border-[#222735] rounded-md p-3">
        <Switch
          checked={pocOnly}
          onCheckedChange={onPocOnlyChange}
          label="PoC Exploit Code"
          description="Only show writeups containing executable scripts or payloads"
        />
      </div>

      {/* Minimum Quality Score Slider */}
      <div className="bg-[#0F1218] border border-[#222735] rounded-md p-3">
        <Slider
          label="Minimum Quality Rating"
          value={minQuality}
          min={1}
          max={10}
          onChange={onMinQualityChange}
        />
      </div>

      {/* Categories Facet */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">Categories</label>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className={`w-full text-xs px-2.5 py-1.5 rounded text-left flex items-center justify-between border transition-colors ${
                selectedCategory === null
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-medium"
                  : "bg-[#0F1218] text-slate-400 hover:text-slate-200 border-[#222735]"
              }`}
            >
              <span>All Categories</span>
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                  className={`w-full text-xs px-2.5 py-1.5 rounded text-left flex items-center justify-between border transition-colors ${
                    isSelected
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-medium"
                      : "bg-[#0F1218] text-slate-400 hover:text-slate-200 border-[#222735]"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
