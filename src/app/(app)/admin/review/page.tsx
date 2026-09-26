"use client";

import { useAdminQueue } from "@/hooks/useAdminQueue";
import { ReviewActiveCard } from "@/components/admin/ReviewActiveCard";
import { PendingTable } from "@/components/admin/PendingTable";
import { Button } from "@/components/ui/Button";
import { RefreshCw, CheckCircle2, AlertCircle, Compass } from "lucide-react";
import Link from "next/link";

export default function ReviewQueuePage() {
  const {
    queue,
    categories,
    activeItem,
    setActiveItem,
    isLoading,
    isMutating,
    error,
    notification,
    clearNotification,
    publishWalkthrough,
    markDeadLink,
    rejectWalkthrough,
    deleteWalkthrough,
    refreshQueue,
  } = useAdminQueue();

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222735]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Review Workspace
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              LIVE QUEUE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Curate, score, and verify incoming CTF walkthrough submissions before publishing them to the public index.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/discover">
            <Button variant="secondary" size="sm">
              <Compass className="w-3.5 h-3.5 mr-1.5" />
              Discover Writeups
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshQueue}
            isLoading={isLoading}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={clearNotification}
            className="text-slate-400 hover:text-slate-200 text-xs underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Active Focused Card Workspace */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>Active Review Target</span>
          <span>{queue.length} items awaiting review</span>
        </div>

        <ReviewActiveCard
          item={activeItem}
          categories={categories}
          isMutating={isMutating}
          onPublish={publishWalkthrough}
          onMarkDead={markDeadLink}
          onReject={rejectWalkthrough}
          onDelete={deleteWalkthrough}
        />
      </div>

      {/* Pending Queue Table */}
      <div className="pt-2">
        <PendingTable
          items={queue}
          activeId={activeItem?.id || null}
          onSelect={setActiveItem}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
