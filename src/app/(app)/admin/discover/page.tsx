"use client";

import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { DiscoverResultItem } from "@/types/walkthrough";
import { DiscoverQuerySchema, IngestPayloadSchema } from "@/lib/validations/admin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Compass,
  Search,
  Plus,
  Check,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Layers,
} from "lucide-react";
import { extractHostname } from "@/lib/utils";

const PRESET_TOPICS = [
  "Hack The Box active directory writeup",
  "TryHackMe privilege escalation walkthrough",
  "VulnHub web exploit writeup",
  "PortSwigger SQL injection walkthrough",
  "CTFtime binary exploitation writeup",
];

export default function DiscoverPage() {
  const [topic, setTopic] = React.useState("");
  const [totalWanted, setTotalWanted] = React.useState(10);
  const [results, setResults] = React.useState<DiscoverResultItem[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [addedLinks, setAddedLinks] = React.useState<Set<string>>(new Set());
  const [addingLink, setAddingLink] = React.useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent, overrideTopic?: string) => {
    if (e) e.preventDefault();
    const queryTopic = overrideTopic || topic;

    const validated = DiscoverQuerySchema.safeParse({ topic: queryTopic, totalWanted });
    if (!validated.success) {
      setError(validated.error.issues[0]?.message || "Invalid search topic");
      return;
    }

    setError(null);
    setIsSearching(true);
    try {
      const res = await apiClient.discoverWalkthroughs(queryTopic, totalWanted);
      setResults(res.Results || []);
    } catch (err: any) {
      setError(err.message || "Failed to query Google search engine");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddWalkthrough = async (item: DiscoverResultItem) => {
    const validated = IngestPayloadSchema.safeParse({
      title: item.title,
      link: item.link,
      description: item.description,
    });

    if (!validated.success) {
      setError(validated.error.issues[0]?.message || "Invalid walkthrough data");
      return;
    }

    setAddingLink(item.link);
    setError(null);
    try {
      await apiClient.createAdminWalkthrough(validated.data);
      setAddedLinks((prev) => new Set(prev).add(item.link));
    } catch (err: any) {
      setError(err.message || "Failed to add walkthrough to review queue");
    } finally {
      setAddingLink(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#222735]">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            Discover Walkthroughs
          </h1>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            SERP COLLECTION
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Automate security writeup discovery from indexed search results. Review and stage them directly into the review workspace.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Input Box */}
      <div className="bg-[#14171F] border border-[#222735] rounded-lg p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Search topic e.g., 'Hack The Box Forest walkthrough' or 'CVE-2024 exploit writeup'..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={totalWanted}
              onChange={(e) => setTotalWanted(Number(e.target.value))}
              className="bg-[#0F1218] text-slate-300 text-xs rounded-md border border-[#222735] px-3 py-2 h-[38px] focus:outline-none focus:border-emerald-500"
            >
              <option value={10}>10 Results</option>
              <option value={20}>20 Results</option>
              <option value={30}>30 Results</option>
            </select>
            <Button type="submit" isLoading={isSearching} className="h-[38px]">
              <Compass className="w-4 h-4 mr-1.5" />
              Discover
            </Button>
          </div>
        </form>

        {/* Preset chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 text-[11px] font-mono">Suggested:</span>
          {PRESET_TOPICS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setTopic(preset);
                handleSearch(undefined, preset);
              }}
              className="text-[11px] px-2.5 py-1 rounded bg-[#1A1E29] hover:bg-[#222735] text-slate-300 border border-[#222735] transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>Search Results ({results.length})</span>
          {results.length > 0 && <span>Click "Stage to Review" to ingest into queue</span>}
        </div>

        {results.length === 0 && !isSearching && (
          <div className="bg-[#14171F] border border-[#222735] rounded-lg p-12 text-center text-slate-500 text-sm">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            Enter a CTF target or vulnerability topic above to query fresh writeups.
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {results.map((res, index) => {
            const isAdded = addedLinks.has(res.link);
            const isAdding = addingLink === res.link;

            return (
              <div
                key={index}
                className="bg-[#14171F] border border-[#222735] hover:border-[#2E3547] rounded-lg p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500 uppercase">
                      #{index + 1}
                    </span>
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-slate-100 hover:text-emerald-400 transition-colors line-clamp-1 inline-flex items-center gap-1.5"
                    >
                      {res.title}
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    </a>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {res.description || "No preview snippet provided."}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>Domain: <strong className="text-slate-400">{extractHostname(res.link)}</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isAdded ? "outline" : "primary"}
                    disabled={isAdded || isAdding}
                    isLoading={isAdding}
                    onClick={() => handleAddWalkthrough(res)}
                    className={isAdded ? "text-emerald-400 border-emerald-500/30" : ""}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1" />
                        In Review Queue
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Stage to Review
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
