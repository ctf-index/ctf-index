import { z } from "zod";
import {
  DifficultyEnum,
  LinkStatusEnum,
  WalkthroughStatusEnum,
  ReviewActionSchema,
  IngestPayloadSchema,
  CategoryFormSchema,
  DiscoverQuerySchema,
} from "@/lib/validations/admin";
import { SearchQuerySchema } from "@/lib/validations/search";

export type Difficulty = z.infer<typeof DifficultyEnum>;
export type LinkStatus = z.infer<typeof LinkStatusEnum>;
export type WalkthroughStatus = z.infer<typeof WalkthroughStatusEnum>;

export type ReviewActionPayload = z.infer<typeof ReviewActionSchema>;
export type IngestPayload = z.infer<typeof IngestPayloadSchema>;
export type CategoryFormPayload = z.infer<typeof CategoryFormSchema>;
export type DiscoverQueryPayload = z.infer<typeof DiscoverQuerySchema>;
export type SearchQueryParams = z.infer<typeof SearchQuerySchema>;

export interface Category {
  id: string;
  name: string;
}

export interface WalkthroughCategoryRelation {
  category: Category;
}

export interface Walkthrough {
  id: string;
  title: string;
  description: string;
  link: string;
  link_status: LinkStatus;
  last_checked_at: string;
  quality_score: number;
  archived_snapshot_link: string;
  difficulty: Difficulty;
  status: WalkthroughStatus;
  added_by: string;
  reviewed_by: string | null;
  createdAt: string;
  updatedAt: string;
  categories: WalkthroughCategoryRelation[];
}

export interface GetWalkthroughsResponse {
  success: boolean;
  message: string;
  walkthroughs: Walkthrough[];
  nextCursor: string | null;
}

export interface GetAdminWalkthroughsResponse {
  success: boolean;
  message: string;
  walkthroughs: Walkthrough[];
}

export interface CreateWalkthroughResponse {
  success: boolean;
  message: string;
  walkthrough?: Walkthrough;
  error?: string;
  WalkthroughId?: string;
}

export interface UpdateWalkthroughResponse {
  success: boolean;
  message: string;
  updated: Walkthrough;
  error?: string;
}

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  categories: Category[];
}

export interface DiscoverResultItem {
  title: string;
  description: string;
  link: string;
  source: string;
}

export interface DiscoverResponse {
  success: boolean;
  message: string;
  Length: number;
  Results: DiscoverResultItem[];
}
