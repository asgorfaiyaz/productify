import { isNull, sql } from "drizzle-orm";
import db from "../db/index.js";
import { ProductsTable, UsersTable } from "../db/schema.js";

export const getDashboardProductsFromService = async (
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  const products = await db.query.ProductsTable.findMany({
    with: {
      owner: {
        columns: {
          name: true,
        },
      },
    },
    columns: {
      title: true,
      description: true,
      priceInCents: true,
      status: true,
      imageUrl: true,
      createdAt: true,
    },
    limit,
    offset,
  });
  const [{ total: totalProducts }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(ProductsTable);

  const totalPages = Math.ceil(totalProducts / limit);
  return {
    products,
    totalProducts,
    totalPages,
  };
};
export const getDashboardUsersFromService = async (
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  const users = await db.query.UsersTable.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      imageUrl: true,
      createdAt: true,
    },
    where: isNull(UsersTable.deletedAt),
    limit,
    offset,
  });
  const [{ total: totalUsers }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(ProductsTable);

  const totalPages = Math.ceil(totalUsers / limit);
  return {
    users,
    totalUsers,
    totalPages,
  };
};
