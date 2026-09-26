"use client";

import { useWalkthroughSearch } from "@/hooks/useWalkthroughSearch";
import { SearchHero } from "@/components/search/SearchHero";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { WalkthroughCard } from "@/components/search/WalkthroughCard";
import { Button } from "@/components/ui/Button";
import { Sparkles, Terminal, AlertCircle } from "lucide-react";

export default function PublicSearchPage() {
  const {
    items,
    allCount,
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
  } = useWalkthroughSearch();

  return (
    <div className="space-y-8 pb-16">
      {/* Omni-search Hero Section */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <SearchHero
          query={query}
          onQueryChange={setQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
        />
      </section>

      {/* Main Two-Column Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Facet Filters */}
          <aside className="lg:col-span-1 lg:sticky lg:top-20">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedPlatform={selectedPlatform}
              onSelectPlatform={setSelectedPlatform}
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
              minQuality={minQuality}
              onMinQualityChange={setMinQuality}
              pocOnly={pocOnly}
              onPocOnlyChange={setPocOnly}
              onReset={resetFilters}
            />
          </aside>

          {/* Right Column: Walkthrough Result Cards */}
          <main className="lg:col-span-3 space-y-4">
            {/* Results count & status */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1 pb-1 border-b border-[#222735]">
              <span>
                Found <strong className="text-emerald-400">{items.length}</strong> matching writeups
              </span>
              <span>
                {selectedCategory ? "Filtered by Category" : "All Preserved Targets"}
              </span>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isLoading && items.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-36 rounded-lg bg-[#14171F] border border-[#222735] animate-pulse"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="bg-[#14171F] border border-[#222735] rounded-lg p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-[#222735] flex items-center justify-center text-slate-400 mx-auto">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-slate-200">
                  No Walkthroughs Found
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No published writeups matched your current search parameters or facet filters.
                </p>
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {items.map((walkthrough) => (
                  <WalkthroughCard key={walkthrough.id} item={walkthrough} />
                ))}

                {hasMore && (
                  <div className="pt-4 text-center">
                    <Button variant="outline" onClick={loadMore} isLoading={isLoading}>
                      Load More Walkthroughs
                    </Button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}