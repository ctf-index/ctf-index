"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, ChevronDown, Check } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select categories...",
  label,
  className,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const removeOption = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== val));
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabels = selected
    .map((id) => options.find((o) => o.value === id))
    .filter(Boolean) as MultiSelectOption[];

  return (
    <div className={cn("w-full relative", className)} ref={containerRef}>
      {label && <label className="block text-xs font-medium text-slate-300 mb-1.5">{label}</label>}

      {/* Selected Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "min-h-[38px] w-full bg-[#0F1218] rounded-md border border-[#222735] px-2.5 py-1.5 flex flex-wrap items-center gap-1.5 cursor-pointer transition-colors",
          isOpen && "border-emerald-500/80 ring-1 ring-emerald-500/30"
        )}
      >
        {selectedLabels.length === 0 ? (
          <span className="text-sm text-slate-500">{placeholder}</span>
        ) : (
          selectedLabels.map((item) => (
            <span
              key={item.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[#1A1E29] text-slate-200 border border-[#222735] rounded font-medium"
            >
              {item.label}
              <button
                type="button"
                onClick={(e) => removeOption(item.value, e)}
                className="text-slate-400 hover:text-slate-100 p-0.5 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
        <ChevronDown className="w-4 h-4 text-slate-500 ml-auto shrink-0" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-[#14171F] border border-[#222735] rounded-md shadow-xl overflow-hidden py-1 max-h-60 flex flex-col">
          <div className="p-2 border-b border-[#222735]">
            <input
              type="text"
              placeholder="Search taxonomy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F1218] text-xs text-slate-200 px-2 py-1.5 rounded border border-[#222735] focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          <div className="overflow-y-auto flex-1 py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-500 text-center">No categories found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={cn(
                      "px-3 py-1.5 text-xs flex items-center justify-between cursor-pointer hover:bg-[#1A1E29] transition-colors",
                      isSelected ? "text-emerald-400 bg-emerald-500/5 font-medium" : "text-slate-300"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
