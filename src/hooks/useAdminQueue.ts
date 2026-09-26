"use client";

import { useState, useEffect, useCallback } from "react";
import { Walkthrough, Category, ReviewActionPayload } from "@/types/walkthrough";
import { apiClient } from "@/lib/api-client";
import { ReviewActionSchema } from "@/lib/validations/admin";

export function useAdminQueue(initialId?: string) {
  const [queue, setQueue] = useState<Walkthrough[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeItem, setActiveItem] = useState<Walkthrough | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const clearNotification = () => setNotification(null);

  const fetchQueue = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [walkthroughRes, catRes] = await Promise.all([
        apiClient.getAdminWalkthroughs("pending"),
        apiClient.getCategories(),
      ]);

      const items = walkthroughRes.walkthroughs || [];
      setQueue(items);
      setCategories(catRes.categories || []);

      if (initialId) {
        const found = items.find((w) => w.id === initialId);
        if (found) {
          setActiveItem(found);
        } else if (items.length > 0) {
          setActiveItem(items[0]);
        }
      } else {
        setActiveItem((prev) => {
          if (prev && items.some((i) => i.id === prev.id)) {
            return items.find((i) => i.id === prev.id) || null;
          }
          return items.length > 0 ? items[0] : null;
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to load review queue");
    } finally {
      setIsLoading(false);
    }
  }, [initialId]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Publish Walkthrough
  const publishWalkthrough = async (id: string, payload: Partial<ReviewActionPayload>) => {
    setIsMutating(true);
    setError(null);
    try {
      // Validate payload with Zod
      const validated = ReviewActionSchema.parse({
        ...payload,
        status: "verified",
      });

      const res = await apiClient.updateAdminWalkthrough(id, validated);
      setNotification({
        type: "success",
        text: res.message || "Walkthrough verified and published!",
      });

      // Remove from pending queue
      setQueue((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (activeItem?.id === id) {
          setActiveItem(next[0] || null);
        }
        return next;
      });

      return { success: true, updated: res.updated };
    } catch (err: any) {
      const msg = err.issues ? err.issues[0]?.message : err.message || "Failed to publish walkthrough";
      setError(msg);
      setNotification({ type: "error", text: msg });
      return { success: false, error: msg };
    } finally {
      setIsMutating(false);
    }
  };

  // Mark as dead link
  const markDeadLink = async (id: string) => {
    setIsMutating(true);
    setError(null);
    try {
      const res = await apiClient.updateAdminWalkthrough(id, { link_status: "dead" });
      setNotification({
        type: "success",
        text: "Walkthrough link flagged as dead.",
      });

      setQueue((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, link_status: "dead" } : item
        )
      );

      if (activeItem?.id === id) {
        setActiveItem((prev) => (prev ? { ...prev, link_status: "dead" } : null));
      }

      return { success: true };
    } catch (err: any) {
      const msg = err.message || "Failed to mark as dead link";
      setError(msg);
      setNotification({ type: "error", text: msg });
      return { success: false, error: msg };
    } finally {
      setIsMutating(false);
    }
  };

  // Reject Walkthrough
  const rejectWalkthrough = async (id: string) => {
    setIsMutating(true);
    setError(null);
    try {
      await apiClient.updateAdminWalkthrough(id, { status: "rejected" });
      setNotification({
        type: "success",
        text: "Walkthrough rejected and archived from queue.",
      });

      setQueue((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (activeItem?.id === id) {
          setActiveItem(next[0] || null);
        }
        return next;
      });

      return { success: true };
    } catch (err: any) {
      const msg = err.message || "Failed to reject walkthrough";
      setError(msg);
      setNotification({ type: "error", text: msg });
      return { success: false, error: msg };
    } finally {
      setIsMutating(false);
    }
  };

  // Delete Walkthrough
  const deleteWalkthrough = async (id: string) => {
    setIsMutating(true);
    setError(null);
    try {
      await apiClient.deleteAdminWalkthrough(id);
      setNotification({
        type: "success",
        text: "Walkthrough removed permanently.",
      });

      setQueue((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (activeItem?.id === id) {
          setActiveItem(next[0] || null);
        }
        return next;
      });

      return { success: true };
    } catch (err: any) {
      const msg = err.message || "Failed to delete walkthrough";
      setError(msg);
      setNotification({ type: "error", text: msg });
      return { success: false, error: msg };
    } finally {
      setIsMutating(false);
    }
  };

  return {
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
    refreshQueue: fetchQueue,
    pendingCount: queue.length,
  };
}
