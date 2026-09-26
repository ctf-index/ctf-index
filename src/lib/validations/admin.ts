import { z } from "zod";

export const DifficultyEnum = z.enum(["beginner", "intermediate", "advanced"]);
export const LinkStatusEnum = z.enum(["alive", "dead"]);
export const WalkthroughStatusEnum = z.enum(["pending", "verified", "rejected"]);

// Schema for updating a walkthrough in the active review workspace
export const ReviewActionSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title must be under 300 characters"),
  description: z.string().max(3000, "Description must be under 3000 characters").default(""),
  link: z.string().url("Must be a valid URL"),
  link_status: LinkStatusEnum.default("alive"),
  quality_score: z.number().int().min(1, "Quality score must be at least 1").max(10, "Quality score cannot exceed 10").default(5),
  difficulty: DifficultyEnum.default("beginner"),
  status: WalkthroughStatusEnum.default("verified"),
  categories: z.array(z.string().uuid("Invalid category ID")).default([]),
  platform: z.string().optional().default(""),
  hasPoc: z.boolean().default(false),
});

export type ReviewActionPayload = z.infer<typeof ReviewActionSchema>;

// Schema for ingesting a walkthrough into the review queue
export const IngestPayloadSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title must be under 300 characters"),
  link: z.string().url("Must be a valid URL"),
  description: z.string().max(3000).optional().default(""),
});

export type IngestPayload = z.infer<typeof IngestPayloadSchema>;

// Schema for Category creation and rename
export const CategoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Category name must be under 100 characters"),
});

export type CategoryFormPayload = z.infer<typeof CategoryFormSchema>;

// Schema for Discover (SerpApi query)
export const DiscoverQuerySchema = z.object({
  topic: z.string().min(1, "Search topic is required"),
  totalWanted: z.number().int().min(1).max(30).default(10),
});

export type DiscoverQueryPayload = z.infer<typeof DiscoverQuerySchema>;
