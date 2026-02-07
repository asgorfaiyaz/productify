import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { ProductsTable } from "./products.js";
import { CategoriesTable } from "./categories.js";
import { relations } from "drizzle-orm";

export const ProductsToCategoriesTable = pgTable(
  "products_to_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => ProductsTable.id),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => CategoriesTable.id),
  },
  (t) => [primaryKey({ columns: [t.productId, t.categoryId] })],
);

export const ProductsToCategoriesRelations = relations(
  ProductsToCategoriesTable,
  ({ one }) => ({
    product: one(ProductsTable, {
      fields: [ProductsToCategoriesTable.productId],
      references: [ProductsTable.id],
    }),
    category: one(CategoriesTable, {
      fields: [ProductsToCategoriesTable.categoryId],
      references: [CategoriesTable.id],
    }),
  }),
);
