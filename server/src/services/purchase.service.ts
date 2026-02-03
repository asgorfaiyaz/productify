// import { eq, sql } from "drizzle-orm";
// import db from "../db/index.js";
// import { PurchasesTable } from "../db/schema.js";

// export const insertOrder = async (data: {
//   userId: string;
//   productId: string;
//   priceInCents: number;
// }) => {
//   const [purchase] = await db.insert(PurchasesTable).values(data).returning();
//   return purchase;
// };

// export const getSalesByUserIdFromDB = async (userId: string) => {
//   const purchases = await db.query.PurchasesTable.findMany({
//     where: eq(PurchasesTable.userId, userId),
//     columns: {
//       priceInCents: true,
//     },
//   });
//   const totalSalesAmount = purchases.reduce(
//     (acc, curr) => acc + (curr.priceInCents ?? 0),
//     0,
//   );

//   const [{ total: totalSales }] = await db
//     .select({ total: sql<number>`count(*)` })
//     .from(PurchasesTable)
//     .where(eq(PurchasesTable.userId, userId));

//   const averageSaleValue = totalSalesAmount / totalSales;

//   return {
//     totalSalesAmount,
//     totalSales,
//     averageSaleValue,
//   };
// };
