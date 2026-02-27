import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import db from "../db/index.js";
import {
  CategoriesTable,
  ProductsTable,
  ProductsToCategoriesTable,
  PurchasesTable,
  UsersTable,
} from "../db/schema.js";

export const getDashboardProductsFromService = async (
  page: number,
  limit: number,
  categoryId?: string,
  search?: string,
) => {
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(sql`${ProductsTable.title} ILIKE ${`%${search}%`}`);
  }

  if (categoryId) {
    conditions.push(
      inArray(
        ProductsTable.id,
        db
          .select({ productId: ProductsToCategoriesTable.productId })
          .from(ProductsToCategoriesTable)
          .where(eq(ProductsToCategoriesTable.categoryId, categoryId)),
      ),
    );
  }
  const whereConditions = conditions.length ? and(...conditions) : undefined;

  const products = await db.query.ProductsTable.findMany({
    with: {
      owner: {
        columns: { name: true },
      },
    },
    columns: {
      id: true,
      title: true,
      description: true,
      priceInCents: true,
      status: true,
      imageUrl: true,
      createdAt: true,
    },
    where: whereConditions,
    limit,
    offset,
  });

  const [{ total: totalProducts }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(ProductsTable)
    .where(whereConditions);

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    totalProducts,
    totalPages,
  };
};

export const getDashboardOverviewFromService = async () => {
  const overview = await db
    .select({
      totalProducts: sql<number>`count(*)`,
      totalPublicProducts: sql<number>`count(*) filter (where status = 'public')`,
      totalPrivateProducts: sql<number>`count(*) filter (where status = 'private')`,
    })
    .from(ProductsTable);
  const sales = await db
    .select({
      totalSales: sql<number>`count(*)`,
      totalRevenue: sql<number>`sum(total_amount)`,
      avgSales: sql<number>`avg(total_amount)`,
    })
    .from(PurchasesTable);
  return { ...overview[0], ...sales[0] };
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

export const getDashboardSalesFromService = async (
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  const sales = await db.query.PurchasesTable.findMany({
    columns: {
      id: true,
      createdAt: true,
      totalAmount: true,
      isPaid: true,
    },
    with: {
      items: {
        columns: {
          id: true,
          priceInCents: true,
          quantity: true,
        },
      },
      owner: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    limit,
    offset,
  });
  const totalSales = await db.$count(PurchasesTable);
  const totalPages = Math.ceil(totalSales / limit);
  return {
    sales,
    totalSales,
    totalPages,
  };
};

export const getDashboardCategoriesFromService = async (
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  const categories = await db.query.CategoriesTable.findMany({
    columns: {
      id: true,
      name: true,
      createdAt: true,
    },
    limit,
    offset,
  });
  const totalCategories = await db.$count(CategoriesTable);
  const totalPages = Math.ceil(totalCategories / limit);
  return {
    categories,
    totalCategories,
    totalPages,
  };
};
export const createCategoryFromDashboard = async (name: string) => {
  const [category] = await db
    .insert(CategoriesTable)
    .values({
      name,
    })
    .returning();
  return category;
};
