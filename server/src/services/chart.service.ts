import { sql, gte, lte, and } from "drizzle-orm";
import { startOfDay, endOfDay } from "date-fns";
import db from "../db/index.js";
import { PurchasesTable } from "../db/schema.js";

export interface OrdersByDateParams {
  from: Date;
  to: Date;
}

export interface OrdersByDateResult {
  date: string;
  totalOrders: number;
  totalRevenue: number;
}

export async function getOrdersByDate(
  params: OrdersByDateParams,
): Promise<OrdersByDateResult[]> {
  const { from, to } = params;

  const rows = await db
    .select({
      date: sql<string>`DATE(${PurchasesTable.createdAt})`.as("date"),
      totalOrders: sql<number>`COUNT(*)`.as("total_orders"),
      totalRevenue: sql<number>`SUM(${PurchasesTable.totalAmount})`.as(
        "total_revenue",
      ),
    })
    .from(PurchasesTable)
    .where(
      and(
        gte(PurchasesTable.createdAt, startOfDay(from)),
        lte(PurchasesTable.createdAt, endOfDay(to)),
      ),
    )
    .groupBy(sql`DATE(${PurchasesTable.createdAt})`)
    .orderBy(sql`DATE(${PurchasesTable.createdAt}) ASC`);

  return rows.map((row) => ({
    date: row.date,
    totalOrders: Number(row.totalOrders),
    totalRevenue: Number(row.totalRevenue ?? 0),
  }));
}
