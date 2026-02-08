// product.schema.ts
import { z } from "zod";
import { productStatuses } from "../db/schema.js";

export const createProductSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  imageUrl: z.string().url(),
  price: z.number(),
  status: z.enum(productStatuses),
  categoryIds: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();
