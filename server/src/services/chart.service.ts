import { eq, gte, lte, and, asc } from "drizzle-orm";
import db from "../db/index.js";
import { PurchasesTable } from "../db/schema.js";
import { eachDayOfInterval, interval, startOfDay } from "date-fns";

export const getSalesDataByDate = async ({
  createdAfter,
  createdBefore,
}: {
  createdAfter: Date;
  createdBefore?: Date;
}) => {
  const conditions = [];
  if (createdAfter) {
    conditions.push(gte(PurchasesTable.createdAt, createdAfter));
  }
  if (createdBefore) {
    conditions.push(lte(PurchasesTable.createdAt, createdBefore));
  }
  const whereConditions =
    conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db.query.PurchasesTable.findMany({
    columns: {
      createdAt: true,
      totalAmount: true,
    },
    where: whereConditions,
    orderBy: asc(PurchasesTable.createdAt),
  });

  const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  });

  function formatDate(date: Date) {
    return DATE_FORMATTER.format(date);
  }

  const dayArray = eachDayOfInterval(
    interval(
      createdAfter || startOfDay(result[0].createdAt),
      createdBefore || new Date(),
    ),
  ).map((date) => {
    return {
      date: formatDate(date),
      totalSales: 0,
    };
  });

  return {
    data: result.reduce((data, order) => {
      const formattedDate = formatDate(order.createdAt);
      const entry = dayArray.find((day) => day.date === formattedDate);
      if (entry == null) return data;
      entry.totalSales += order.totalAmount / 100;
      return data;
    }, dayArray),
  };
};
