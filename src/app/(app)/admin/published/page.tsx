"use client";

import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { Walkthrough } from "@/types/walkthrough";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FileCheck2,
  Search,
  ExternalLink,
  Archive,
  RefreshCw,
  Ban,
  Trash2,
  Clock,
} from "lucide-react";
import { extractHostname, formatDate } from "@/lib/utils";

export default function PublishedPage() {
  const [items, setItems] = React.useState<Walkthrough[]>([]);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [actionId, setActionId] = React.useState<string | null>(null);

  const loadPublished = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.getAdminWalkthroughs("verified");
      setItems(res.walkthroughs || []);
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPublished();
  }, [loadPublished]);

  const handleUnpublish = async (id: string) => {
    setActionId(id);
    try {
      await apiClient.updateAdminWalkthrough(id, { status: "pending" });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // Handle error
    } finally {
      setActionId(null);
    }
  };

  const handleToggleDeadLink = async (id: string, currentStatus: string) => {
    setActionId(id);
    try {
      const nextStatus = currentStatus === "alive" ? "dead" : "alive";
      await apiClient.updateAdminWalkthrough(id, { link_status: nextStatus as any });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, link_status: nextStatus as any } : item))
      );
    } catch {
      // Handle error
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this walkthrough?")) return;
    setActionId(id);
    try {
      await apiClient.deleteAdminWalkthrough(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // Handle error
    } finally {
      setActionId(null);
    }
  };

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.link.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222735]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Published Walkthroughs
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              INDEXED CATALOG
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active writeups visible on the public search engine. Manage snapshots, edit tags, and prune obsolete entries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadPublished} isLoading={isLoading}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#14171F] border border-[#222735] rounded-lg p-4">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter published entries..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Showing {filtered.length} of {items.length} verified walkthroughs
        </div>
      </div>

      {/* Published Table */}
      <div className="bg-[#14171F] border border-[#222735] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#222735] text-slate-400 bg-[#0F1218] font-mono">
                <th className="py-2.5 px-4 font-medium">Walkthrough</th>
                <th className="py-2.5 px-4 font-medium">Difficulty</th>
                <th className="py-2.5 px-4 font-medium">Score</th>
                <th className="py-2.5 px-4 font-medium">Link Status</th>
                <th className="py-2.5 px-4 font-medium">Snapshot</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222735]/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    {isLoading ? "Loading published catalog..." : "No published entries found."}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1A1E29] transition-colors">
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-slate-100 hover:text-emerald-400 transition-colors line-clamp-1 inline-flex items-center gap-1.5"
                        >
                          {item.title}
                          <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                        </a>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-slate-500 font-mono">
                            {extractHostname(item.link)}
                          </span>
                          {item.categories?.map((rel) => (
                            <span
                              key={rel.category.id}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-[#1A1E29] text-slate-400 border border-[#222735]"
                            >
                              {rel.category.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="difficulty" difficulty={item.difficulty}>
                        {item.difficulty}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold">
                      <span className="text-emerald-400">{item.quality_score}</span>
                      <span className="text-slate-500">/10</span>
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant="linkStatus" linkStatus={item.link_status}>
                        {item.link_status}
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
                          <span>Wayback</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500">None</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleDeadLink(item.id, item.link_status)}
                          disabled={actionId === item.id}
                          className="h-7 px-2 text-slate-400 hover:text-amber-400"
                          title="Toggle Dead Link"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUnpublish(item.id)}
                          disabled={actionId === item.id}
                          className="h-7 px-2.5 text-xs"
                        >
                          Unpublish
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          disabled={actionId === item.id}
                          className="h-7 px-2 text-slate-500 hover:text-rose-400"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
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
