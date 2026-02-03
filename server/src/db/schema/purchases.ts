import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelper.js";
import { UsersTable } from "./users.js";
import { ProductsTable } from "./products.js";
import { relations } from "drizzle-orm";

// Purchases table
export const PurchasesTable = pgTable("purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => UsersTable.id, { onDelete: "cascade" })
    .notNull(),
  totalAmount: integer().notNull(),
  isPaid: boolean().default(false),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  createdAt,
  updatedAt,
});

// Purchase items table
export const PurchaseItemsTable = pgTable("purchase_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  purchaseId: uuid("purchase_id")
    .references(() => PurchasesTable.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id")
    .references(() => ProductsTable.id, { onDelete: "restrict" })
    .notNull(),
  quantity: integer().notNull(),
  priceInCents: integer().notNull(),
});

// Relations
export const purchasesRelations = relations(
  PurchasesTable,
  ({ many, one }) => ({
    owner: one(UsersTable, {
      fields: [PurchasesTable.userId],
      references: [UsersTable.id],
    }),
    items: many(PurchaseItemsTable),
  }),
);

export const purchaseItemsRelations = relations(
  PurchaseItemsTable,
  ({ one }) => ({
    product: one(ProductsTable, {
      fields: [PurchaseItemsTable.productId],
      references: [ProductsTable.id],
    }),
    purchase: one(PurchasesTable, {
      fields: [PurchaseItemsTable.purchaseId],
      references: [PurchasesTable.id],
    }),
  }),
);
