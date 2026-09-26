"use client";

import * as React from "react";
import { Walkthrough, Category, Difficulty, ReviewActionPayload } from "@/types/walkthrough";
import { ReviewActionSchema } from "@/lib/validations/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { Badge } from "@/components/ui/Badge";
import {
  ExternalLink,
  ShieldCheck,
  Ban,
  Trash2,
  AlertTriangle,
  Globe,
  Sparkles,
  Archive,
} from "lucide-react";
import { extractHostname, formatDate } from "@/lib/utils";

interface ReviewActiveCardProps {
  item: Walkthrough | null;
  categories: Category[];
  isMutating: boolean;
  onPublish: (id: string, payload: Partial<ReviewActionPayload>) => Promise<any>;
  onMarkDead: (id: string) => Promise<any>;
  onReject: (id: string) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

const PLATFORMS = [
  { value: "HackTheBox", label: "Hack The Box" },
  { value: "TryHackMe", label: "TryHackMe" },
  { value: "VulnHub", label: "VulnHub" },
  { value: "PortSwigger", label: "PortSwigger Academy" },
  { value: "CTFtime", label: "CTFtime" },
  { value: "PicoCTF", label: "PicoCTF" },
  { value: "Root-Me", label: "Root-Me" },
  { value: "Custom", label: "Independent / Other" },
];

export function ReviewActiveCard({
  item,
  categories,
  isMutating,
  onPublish,
  onMarkDead,
  onReject,
  onDelete,
}: ReviewActiveCardProps) {
  // Form State
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [link, setLink] = React.useState("");
  const [platform, setPlatform] = React.useState("HackTheBox");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("beginner");
  const [qualityScore, setQualityScore] = React.useState(5);
  const [hasPoc, setHasPoc] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  // Sync state whenever active item changes
  React.useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setLink(item.link || "");
      setDifficulty(item.difficulty || "beginner");
      setQualityScore(item.quality_score && item.quality_score > 0 ? item.quality_score : 6);
      setSelectedCategories(
        item.categories?.map((rel) => rel.category?.id).filter(Boolean) || []
      );

      // Guess platform based on link
      const lowerLink = (item.link || "").toLowerCase();
      if (lowerLink.includes("hackthebox")) setPlatform("HackTheBox");
      else if (lowerLink.includes("tryhackme")) setPlatform("TryHackMe");
      else if (lowerLink.includes("vulnhub")) setPlatform("VulnHub");
      else if (lowerLink.includes("portswigger")) setPlatform("PortSwigger");
      else if (lowerLink.includes("ctftime")) setPlatform("CTFtime");
      else if (lowerLink.includes("picoctf")) setPlatform("PicoCTF");
      else setPlatform("Custom");

      setHasPoc(
        item.description?.toLowerCase().includes("poc") ||
        item.description?.toLowerCase().includes("exploit") ||
        false
      );
      setValidationError(null);
    }
  }, [item]);

  if (!item) {
    return (
      <div className="bg-[#14171F] border border-[#222735] rounded-lg p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-medium text-slate-200">Review Queue Empty</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          All submitted walkthroughs have been reviewed and published. Trigger the Discover tool to collect more writeups.
        </p>
      </div>
    );
  }

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handlePublish = async () => {
    setValidationError(null);
    const payload = {
      title,
      description,
      link,
      difficulty,
      quality_score: qualityScore,
      categories: selectedCategories,
      platform,
      hasPoc,
      status: "verified" as const,
      link_status: item.link_status,
    };

    // Client-side Zod validation
    const parsed = ReviewActionSchema.safeParse(payload);
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message || "Validation failed");
      return;
    }

    await onPublish(item.id, payload);
  };

  return (
    <div className="bg-[#14171F] border border-[#222735] rounded-lg overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-[#222735] bg-[#0E1017] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
            Reviewing Item
          </span>
          <Badge variant="status" status={item.status}>
            {item.status.toUpperCase()}
          </Badge>
          <Badge variant="linkStatus" linkStatus={item.link_status}>
            {item.link_status.toUpperCase()} LINK
          </Badge>
        </div>

        <div className="text-xs text-slate-500 font-mono flex items-center gap-3">
          <span>Queued: {formatDate(item.createdAt)}</span>
          <span>ID: {item.id.slice(0, 8)}</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {validationError && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Title Input */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Walkthrough Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Hack The Box - Lame Detailed Exploitation & Root"
          />
        </div>

        {/* Source Link Preview */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Original Resource URL
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/walkthrough"
              leftIcon={<Globe className="w-4 h-4" />}
            />
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#1A1E29] hover:bg-[#222735] text-slate-200 border border-[#222735] rounded-md transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit Link</span>
            </a>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
            <span>Domain: <strong className="text-slate-400 font-mono">{extractHostname(link)}</strong></span>
            {item.archived_snapshot_link ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <Archive className="w-3 h-3" /> Wayback snapshot available
              </span>
            ) : (
              <span className="text-slate-500">
                (Wayback snapshot will be initiated on publication)
              </span>
            )}
          </div>
        </div>

        {/* Two-column layout for Platform and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="CTF Platform"
            options={PLATFORMS}
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />

          <MultiSelect
            label="Vulnerability Categories (Taxonomy)"
            options={categoryOptions}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Assign vulnerability tags..."
          />
        </div>

        {/* Difficulty Radio Pills & PoC Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["beginner", "intermediate", "advanced"] as Difficulty[]).map((tier) => {
                const isSelected = difficulty === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setDifficulty(tier)}
                    className={`px-3 py-2 text-xs font-medium capitalize rounded border transition-all text-center ${
                      isSelected
                        ? tier === "beginner"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/50"
                          : tier === "intermediate"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/50"
                          : "bg-rose-500/15 text-rose-400 border-rose-500/50"
                        : "bg-[#0F1218] text-slate-400 border-[#222735] hover:text-slate-200 hover:border-[#353D52]"
                    }`}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="bg-[#0F1218] border border-[#222735] rounded-md p-3">
              <Switch
                checked={hasPoc}
                onCheckedChange={setHasPoc}
                label="Verified PoC Included"
                description="Contains runnable exploit code or payload commands"
              />
            </div>
          </div>
        </div>

        {/* Quality Score Slider */}
        <div className="bg-[#0F1218] border border-[#222735] rounded-md p-3.5">
          <Slider
            label="Curator Quality Score"
            value={qualityScore}
            min={1}
            max={10}
            onChange={setQualityScore}
          />
        </div>

        {/* Exploit Summary */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Exploit Summary & Key Takeaways
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Brief technical breakdown: attack vector, vulnerability chain, tools utilized (e.g. SQLi in auth parameter leading to RCE via file upload)."
          />
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-[#222735] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkDead(item.id)}
              disabled={isMutating}
              className="text-amber-400 hover:text-amber-300 hover:border-amber-500/30"
            >
              <Ban className="w-3.5 h-3.5 mr-1.5" />
              Mark as Dead Link
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(item.id)}
              disabled={isMutating}
              className="text-slate-400 hover:text-rose-400 hover:border-rose-500/30"
            >
              Reject Item
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              disabled={isMutating}
              className="text-slate-500 hover:text-rose-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={handlePublish}
              isLoading={isMutating}
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Verify & Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
