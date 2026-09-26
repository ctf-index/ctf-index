"use client";

import * as React from "react";
import { Walkthrough } from "@/types/walkthrough";
import { Badge } from "@/components/ui/Badge";
import {
  ExternalLink,
  Archive,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  Clock,
  Sparkles,
} from "lucide-react";
import { extractHostname, formatDate } from "@/lib/utils";

interface WalkthroughCardProps {
  item: Walkthrough;
}

export function WalkthroughCard({ item }: WalkthroughCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(item.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = extractHostname(item.link);

  return (
    <article className="group bg-[#14171F] hover:bg-[#161A23] border border-[#222735] hover:border-[#2E3547] rounded-lg p-5 transition-all duration-150 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md">
      <div className="space-y-3">
        {/* Header meta badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-400 bg-[#0F1218] border border-[#222735] px-2 py-0.5 rounded">
              {domain}
            </span>

            <Badge variant="difficulty" difficulty={item.difficulty}>
              {item.difficulty}
            </Badge>

            <div className="flex items-center gap-1 font-mono text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>{item.quality_score}/10</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
            <Clock className="w-3 h-3" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors leading-snug">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1.5"
          >
            <span>{item.title}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0 text-slate-400 group-hover:text-emerald-400 transition-opacity" />
          </a>
        </h3>

        {/* Description snippet */}
        {item.description && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Category tags */}
        {item.categories && item.categories.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {item.categories.map((rel) => (
              <span
                key={rel.category.id}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0F1218] text-slate-400 border border-[#222735]"
              >
                #{rel.category.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer link preservation & quick actions */}
      <div className="pt-3 border-t border-[#222735]/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {item.archived_snapshot_link ? (
            <a
              href={item.archived_snapshot_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors font-mono"
              title="Read immutable snapshot from Wayback Machine"
            >
              <Archive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Wayback Backup</span>
            </a>
          ) : (
            <span className="text-[11px] text-slate-500 font-mono">
              Live link verified
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1A1E29] rounded transition-colors inline-flex items-center gap-1 text-[11px]"
            title="Copy URL"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
