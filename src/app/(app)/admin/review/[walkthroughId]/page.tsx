"use client";

import * as React from "react";
import { useAdminQueue } from "@/hooks/useAdminQueue";
import { ReviewActiveCard } from "@/components/admin/ReviewActiveCard";
import { PendingTable } from "@/components/admin/PendingTable";
import { Button } from "@/components/ui/Button";
import { RefreshCw, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ walkthroughId: string }>;
}

export default function ReviewTargetPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const walkthroughId = resolvedParams.walkthroughId;

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
  } = useAdminQueue(walkthroughId);

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222735]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/review"
              className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all queued</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Focused Review: <span className="text-emerald-400 font-mono text-sm">{walkthroughId.slice(0, 8)}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Active Focused Card */}
      <ReviewActiveCard
        item={activeItem}
        categories={categories}
        isMutating={isMutating}
        onPublish={publishWalkthrough}
        onMarkDead={markDeadLink}
        onReject={rejectWalkthrough}
        onDelete={deleteWalkthrough}
      />

      {/* Pending Table */}
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
