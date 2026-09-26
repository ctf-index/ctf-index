"use client";

import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { Category } from "@/types/walkthrough";
import { CategoryFormSchema } from "@/lib/validations/admin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadCategories = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.getCategories();
      setCategories(res.categories || []);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validated = CategoryFormSchema.safeParse({ name: newCategoryName });
    if (!validated.success) {
      setError(validated.error.issues[0]?.message || "Invalid category name");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await apiClient.createCategory(validated.data.name);
      setCategories((prev) => [...prev, res.category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategoryName("");
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const validated = CategoryFormSchema.safeParse({ name: editingName });
    if (!validated.success) {
      setError(validated.error.issues[0]?.message || "Invalid category name");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.updateCategory(id, validated.data.name);
      setCategories((prev) =>
        prev
          .map((cat) => (cat.id === id ? { ...cat, name: validated.data.name } : cat))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This unlinks it from walkthroughs.`)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222735]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Taxonomy Categories
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              TAG SYSTEM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Define security vulnerability classes, CTF challenge categories, and attack surfaces used across the index.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadCategories} isLoading={isLoading}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Create New Category Card */}
      <div className="bg-[#14171F] border border-[#222735] rounded-lg p-5 shadow-sm">
        <h2 className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider mb-3">
          Create New Category
        </h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <div className="flex-1 max-w-md">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Active Directory, Web Exploitation, Buffer Overflow..."
              leftIcon={<Tag className="w-4 h-4" />}
            />
          </div>
          <Button type="submit" isLoading={isSubmitting} disabled={!newCategoryName.trim()}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Tag
          </Button>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="bg-[#14171F] border border-[#222735] rounded-lg overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-[#222735] bg-[#0E1017] flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Existing Categories ({categories.length})
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Sorted alphabetically
          </span>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.length === 0 ? (
            <div className="col-span-full py-8 text-center text-slate-500 text-xs">
              {isLoading ? "Loading categories..." : "No taxonomy categories created yet."}
            </div>
          ) : (
            categories.map((cat) => {
              const isEditing = editingId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="bg-[#0F1218] border border-[#222735] hover:border-[#2E3547] rounded-md p-3 flex items-center justify-between gap-2 transition-all"
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full bg-[#1A1E29] text-xs text-slate-100 px-2 py-1 rounded border border-[#222735] focus:outline-none focus:border-emerald-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        disabled={isSubmitting}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 min-w-0">
                        <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="text-xs font-medium text-slate-200 truncate">
                          {cat.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditingName(cat.name);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-[#1A1E29] transition-colors"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
