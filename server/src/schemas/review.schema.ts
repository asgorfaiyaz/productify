// product.schema.ts
import { z } from "zod";

export const createReviewSchema = z.object({
  content: z.string(),
  rating: z.number(),
});

export const updateReviewSchema = createReviewSchema.partial();
