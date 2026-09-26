"use client";

import { Walkthrough } from "@/types/walkthrough";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExternalLink, ArrowRight, Clock, Ban } from "lucide-react";
import { extractHostname, formatDate, cn } from "@/lib/utils";

interface PendingTableProps {
  items: Walkthrough[];
  activeId: string | null;
  onSelect: (item: Walkthrough) => void;
  isLoading: boolean;
}

export function PendingTable({
  items,
  activeId,
  onSelect,
  isLoading,
}: PendingTableProps) {
  if (isLoading && items.length === 0) {
    return (
      <div className="bg-[#14171F] border border-[#222735] rounded-lg p-8 text-center text-slate-500 text-sm">
        Loading pending queue...
      </div>
    );
  }

  return (
    <div className="bg-[#14171F] border border-[#222735] rounded-lg overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-[#222735] bg-[#0E1017] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Pending Queue
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1A1E29] border border-[#222735] text-slate-300">
            {items.length} items
          </span>
        </div>
        <span className="text-xs text-slate-500">Click any item to load into the review workspace</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#222735] text-slate-400 bg-[#0F1218] font-mono">
              <th className="py-2.5 px-4 font-medium">Walkthrough</th>
              <th className="py-2.5 px-4 font-medium">Domain</th>
              <th className="py-2.5 px-4 font-medium">Link Status</th>
              <th className="py-2.5 px-4 font-medium">Added</th>
              <th className="py-2.5 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222735]/60">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                  No pending submissions waiting in the queue.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={cn(
                      "cursor-pointer transition-colors group",
                      isActive
                        ? "bg-emerald-500/5 hover:bg-emerald-500/10"
                        : "hover:bg-[#1A1E29]"
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        <span
                          className={cn(
                            "font-medium text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition-colors",
                            isActive && "text-emerald-300 font-semibold"
                          )}
                        >
                          {item.title}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 hover:text-slate-200 transition-colors"
                      >
                        <span>{extractHostname(item.link)}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="linkStatus" linkStatus={item.link_status}>
                        {item.link_status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-slate-400 font-mono">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant={isActive ? "primary" : "secondary"}
                        className="text-xs h-7 px-2.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(item);
                        }}
                      >
                        <span>{isActive ? "Active" : "Review"}</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
