import { pgTable, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, priceInCents, updatedAt } from "../schemaHelper.js";
import { UsersTable } from "./users.js";
import { relations } from "drizzle-orm";
import { ProductsTable } from "./products.js";

export const PurchasesTable = pgTable("purchases", {
  id,
  priceInCents,
  productId: uuid("product_id")
    .notNull()
    .references(() => ProductsTable.id, { onDelete: "restrict" }),
  userId: uuid("user_id")
    .references(() => UsersTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt,
  updatedAt,
});

export const purchasesRelations = relations(PurchasesTable, ({ one }) => ({
  owner: one(UsersTable, {
    fields: [PurchasesTable.userId],
    references: [UsersTable.id],
  }),
  product: one(ProductsTable, {
    fields: [PurchasesTable.productId],
    references: [ProductsTable.id],
  }),
}));
