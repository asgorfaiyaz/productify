import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { PurchaseItemsTable, PurchasesTable } from "../db/schema.js";

export const insertPurchase = async (
  data: typeof PurchasesTable.$inferInsert,
) => {
  const [res] = await db.insert(PurchasesTable).values(data).returning();
  return res;
};

export const insertPurchaseItem = async (
  data: typeof PurchaseItemsTable.$inferInsert,
) => {
  const [res] = await db.insert(PurchaseItemsTable).values(data).returning();
  return res;
};
export const getSalesDataFromDB = async (userId: string) => {
  return await db.query.PurchasesTable.findMany({
    where: eq(PurchasesTable.userId, userId),
    with: {
      items: {
        columns: {
          priceInCents: true,
          quantity: true,
        },
        with: {
          product: {
            columns: {
              title: true,
              description: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });
};
