"use client";

import * as React from "react";
import { Walkthrough, Category, Difficulty } from "@/types/walkthrough";
import { apiClient } from "@/lib/api-client";

export function useWalkthroughSearch() {
  const [items, setItems] = React.useState<Walkthrough[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Facet States
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = React.useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty | null>(null);
  const [minQuality, setMinQuality] = React.useState<number>(1);
  const [pocOnly, setPocOnly] = React.useState<boolean>(false);
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState<boolean>(false);

  // Load initial data
  const fetchData = React.useCallback(async (catId?: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const [walkthroughRes, catRes] = await Promise.all([
        apiClient.getPublicWalkthroughs({ category: catId || undefined }),
        apiClient.getCategories(),
      ]);

      setItems(walkthroughRes.walkthroughs || []);
      setCategories(catRes.categories || []);
      setCursor(walkthroughRes.nextCursor);
      setHasMore(Boolean(walkthroughRes.nextCursor));
    } catch (err: any) {
      setError(err.message || "Failed to load walkthrough index");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData(selectedCategory);
  }, [fetchData, selectedCategory]);

  // Load more pagination
  const loadMore = async () => {
    if (!cursor || isLoading) return;
    try {
      const res = await apiClient.getPublicWalkthroughs({
        category: selectedCategory || undefined,
        cursor,
      });
      setItems((prev) => [...prev, ...(res.walkthroughs || [])]);
      setCursor(res.nextCursor);
      setHasMore(Boolean(res.nextCursor));
    } catch {
      // Pagination error
    }
  };

  // Filtered walkthroughs
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      // Text search
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesLink = item.link.toLowerCase().includes(q);
        const matchesCategory = item.categories?.some((rel) =>
          rel.category.name.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesDesc && !matchesLink && !matchesCategory) {
          return false;
        }
      }

      // Platform filter
      if (selectedPlatform) {
        const lowerLink = item.link.toLowerCase();
        const lowerPlatform = selectedPlatform.toLowerCase();
        if (!lowerLink.includes(lowerPlatform) && !item.title.toLowerCase().includes(lowerPlatform)) {
          return false;
        }
      }

      // Difficulty filter
      if (selectedDifficulty && item.difficulty !== selectedDifficulty) {
        return false;
      }

      // Minimum quality score
      if (minQuality > 1 && item.quality_score < minQuality) {
        return false;
      }

      // PoC only filter
      if (pocOnly) {
        const desc = item.description.toLowerCase();
        const hasPoc = desc.includes("poc") || desc.includes("exploit") || desc.includes("payload");
        if (!hasPoc) return false;
      }

      return true;
    });
  }, [items, query, selectedPlatform, selectedDifficulty, minQuality, pocOnly]);

  const resetFilters = () => {
    setQuery("");
    setSelectedCategory(null);
    setSelectedPlatform(null);
    setSelectedDifficulty(null);
    setMinQuality(1);
    setPocOnly(false);
  };

  return {
    items: filteredItems,
    allCount: items.length,
    categories,
    isLoading,
    error,
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPlatform,
    setSelectedPlatform,
    selectedDifficulty,
    setSelectedDifficulty,
    minQuality,
    setMinQuality,
    pocOnly,
    setPocOnly,
    hasMore,
    loadMore,
    resetFilters,
  };
}
