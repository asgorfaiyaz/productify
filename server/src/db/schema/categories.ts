import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper.js";
import { relations } from "drizzle-orm";
import { ProductsTable } from "./products.js";
import { ProductsToCategoriesTable } from "./products-categories.js";

export const CategoriesTable = pgTable("categories", {
  id,
  name: text().notNull(),
  createdAt,
  updatedAt,
});

export const CategoriesRelation = relations(CategoriesTable, ({ many }) => ({
  productsCategories: many(ProductsToCategoriesTable),
}));
