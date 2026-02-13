import { pgTable, text, uuid, integer } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper.js";
import { UsersTable } from "./users.js";
import { relations } from "drizzle-orm";
import { ProductsTable } from "./products.js";

export const ReviewsTable = pgTable("reviews", {
  id,
  content: text().notNull(),

  rating: integer("rating").notNull(),

  productId: uuid("product_id")
    .notNull()
    .references(() => ProductsTable.id),

  userId: uuid("user_id")
    .notNull()
    .references(() => UsersTable.id),

  createdAt,
  updatedAt,
});

export const reviewsRelations = relations(ReviewsTable, ({ one }) => ({
  owner: one(UsersTable, {
    fields: [ReviewsTable.userId],
    references: [UsersTable.id],
  }),
  product: one(ProductsTable, {
    fields: [ReviewsTable.productId],
    references: [ProductsTable.id],
  }),
}));
