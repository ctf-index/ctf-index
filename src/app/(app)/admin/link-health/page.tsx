"use client";

import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { Walkthrough } from "@/types/walkthrough";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Archive,
  RefreshCw,
  Ban,
  Check,
} from "lucide-react";
import { extractHostname, formatDate } from "@/lib/utils";

export default function LinkHealthPage() {
  const [items, setItems] = React.useState<Walkthrough[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "dead" | "no-snapshot">("dead");
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [pendingRes, verifiedRes] = await Promise.all([
        apiClient.getAdminWalkthroughs("pending"),
        apiClient.getAdminWalkthroughs("verified"),
      ]);
      setItems([...(verifiedRes.walkthroughs || []), ...(pendingRes.walkthroughs || [])]);
    } catch {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleLinkStatus = async (id: string, current: string) => {
    const next = current === "alive" ? "dead" : "alive";
    setUpdatingId(id);
    try {
      await apiClient.updateAdminWalkthrough(id, { link_status: next as any });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, link_status: next as any } : item))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deadCount = items.filter((i) => i.link_status === "dead").length;
  const aliveCount = items.filter((i) => i.link_status === "alive").length;
  const snapshotCount = items.filter((i) => Boolean(i.archived_snapshot_link)).length;
  const healthRate = items.length > 0 ? Math.round((aliveCount / items.length) * 100) : 100;

  const filteredItems = items.filter((i) => {
    if (filter === "dead") return i.link_status === "dead";
    if (filter === "no-snapshot") return !i.archived_snapshot_link;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222735]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Link Health Monitor
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              DIAGNOSTICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detect link rot across indexed walkthroughs and ensure fallback Wayback Machine snapshots remain active.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadData} isLoading={isLoading}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh Status
        </Button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#14171F] border border-[#222735] rounded-lg p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500">Fleet Link Health</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {healthRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Overall alive availability</div>
        </div>

        <div className="bg-[#14171F] border border-[#222735] rounded-lg p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500">Alive Links</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
            {aliveCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Verified reachable URLs</div>
        </div>

        <div className="bg-[#14171F] border border-[#222735] rounded-lg p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500">Dead Links</div>
          <div className={`text-2xl font-bold font-mono mt-1 ${deadCount > 0 ? "text-rose-400" : "text-slate-400"}`}>
            {deadCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Flagged 404/expired targets</div>
        </div>

        <div className="bg-[#14171F] border border-[#222735] rounded-lg p-4">
          <div className="text-[11px] font-mono uppercase text-slate-500">Wayback Snapshots</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {snapshotCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Preserved internet archives</div>
        </div>
      </div>

      {/* Filters and List */}
      <div className="bg-[#14171F] border border-[#222735] rounded-lg overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-[#222735] bg-[#0E1017] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("dead")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                filter === "dead"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Dead Links ({deadCount})
            </button>
            <button
              onClick={() => setFilter("no-snapshot")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                filter === "no-snapshot"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Missing Snapshot ({items.length - snapshotCount})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                filter === "all"
                  ? "bg-[#1A1E29] text-slate-200 border border-[#222735]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Links ({items.length})
            </button>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Showing {filteredItems.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#222735] text-slate-400 bg-[#0F1218] font-mono">
                <th className="py-2.5 px-4 font-medium">Walkthrough & Target</th>
                <th className="py-2.5 px-4 font-medium">Domain</th>
                <th className="py-2.5 px-4 font-medium">Link Status</th>
                <th className="py-2.5 px-4 font-medium">Wayback Snapshot</th>
                <th className="py-2.5 px-4 font-medium text-right">Health Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222735]/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No items matching this link health filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1A1E29] transition-colors">
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-medium text-slate-200 line-clamp-1">
                          {item.title}
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-slate-400 hover:text-emerald-400 font-mono truncate max-w-md inline-flex items-center gap-1"
                        >
                          <span className="truncate">{item.link}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      {extractHostname(item.link)}
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="linkStatus" linkStatus={item.link_status}>
                        {item.link_status.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      {item.archived_snapshot_link ? (
                        <a
                          href={item.archived_snapshot_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline font-mono"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Snapshot OK</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-amber-400/80 font-mono flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> No snapshot
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant={item.link_status === "dead" ? "primary" : "outline"}
                        onClick={() => toggleLinkStatus(item.id, item.link_status)}
                        disabled={updatingId === item.id}
                        isLoading={updatingId === item.id}
                        className="h-7 text-xs px-2.5"
                      >
                        {item.link_status === "dead" ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Mark Alive
                          </>
                        ) : (
                          <>
                            <Ban className="w-3 h-3 mr-1 text-rose-400" />
                            Flag Dead
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
