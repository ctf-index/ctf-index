import { z } from "zod";
import { DifficultyEnum } from "./admin";

export const SearchQuerySchema = z.object({
  query: z.string().optional(),
  category: z.string().uuid("Invalid category ID").optional(),
  platform: z.string().optional(),
  difficulty: DifficultyEnum.optional(),
  minQuality: z.number().min(1).max(10).optional(),
  hasPoc: z.boolean().optional(),
  cursor: z.string().optional(),
});

export type SearchQueryParams = z.infer<typeof SearchQuerySchema>;
