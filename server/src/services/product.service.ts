import { and, eq, ilike, inArray, or, sql } from "drizzle-orm";
import type { z } from "zod";
import {
  CommentsTable,
  ProductsTable,
  ProductsToCategoriesTable,
  UsersTable,
} from "../db/schema.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";
import db from "../db/index.js";

type CreateProductInput = z.infer<typeof createProductSchema>;
type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const insertProduct = async (
  userId: string,
  data: CreateProductInput,
) => {
  const { price, categoryIds, ...rest } = data;
  const [product] = await db
    .insert(ProductsTable)
    .values({ ...rest, userId, priceInCents: Math.round(price * 100) })
    .returning();

  if (categoryIds && categoryIds.length > 0) {
    categoryIds.map(async (categoryId) => {
      await db
        .insert(ProductsToCategoriesTable)
        .values({
          productId: product.id,
          categoryId,
        })
        .returning();
    });
  }

  return product;
};

export const updateProductById = async (
  productId: string,
  data: UpdateProductInput,
) => {
  const { price, categoryIds, ...rest } = data;

  const updatedData: Partial<typeof ProductsTable.$inferInsert> = {
    ...rest,
  };

  if (price !== undefined) {
    updatedData.priceInCents = Math.round(price * 100);
  }

  const [product] = await db
    .update(ProductsTable)
    .set(updatedData)
    .where(eq(ProductsTable.id, productId))
    .returning();

  if (categoryIds && categoryIds.length > 0) {
    categoryIds.map(async (categoryId) => {
      const isCategoryLinked =
        await db.query.ProductsToCategoriesTable.findFirst({
          where: and(
            eq(ProductsToCategoriesTable.productId, productId),
            eq(ProductsToCategoriesTable.categoryId, categoryId),
          ),
        });
      if (!isCategoryLinked) {
        await db
          .insert(ProductsToCategoriesTable)
          .values({
            productId: product.id,
            categoryId,
          })
          .returning();
      }
    });
  }

  return product;
};

export const deleteProductById = async (productId: string) => {
  await db.delete(ProductsTable).where(eq(ProductsTable.id, productId));
};

export const getProductById = async (productId: string) => {
  const product = await db.query.ProductsTable.findFirst({
    where: eq(ProductsTable.id, productId),
    with: {
      owner: true,
      comments: {
        with: {
          owner: true,
        },
      },
      productsCategories: {
        with: {
          category: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (!product) throw new Error("product not found");
  const { productsCategories, ...rest } = product;
  return { ...rest, categories: productsCategories.map((c) => c.category) };
};

export const getUserByClerkId = async (clerkId: string) => {
  const res = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.clerkId, clerkId),
    columns: {
      id: true,
      clerkId: true,
    },
  });
  return res;
};
export const getProductsByIds = async (productIds: string[]) => {
  const res = await db.query.ProductsTable.findMany({
    where: inArray(ProductsTable.id, productIds),
  });
  return res;
};
export const isProductExist = async (productId: string) => {
  return await db.query.ProductsTable.findFirst({
    where: eq(ProductsTable.id, productId),
  });
};

export const getAllProducts = async (
  page: number,
  limit: number,
  categoryId?: string,
  search?: string,
) => {
  const offset = (page - 1) * limit;

  const searchCondition = search
    ? or(
        ilike(ProductsTable.title, `%${search}%`),
        ilike(ProductsTable.description, `%${search}%`),
      )
    : undefined;

  const whereCondition =
    categoryId && search
      ? and(
          eq(ProductsToCategoriesTable.categoryId, categoryId),
          searchCondition,
        )
      : categoryId
        ? eq(ProductsToCategoriesTable.categoryId, categoryId)
        : search
          ? searchCondition
          : undefined;

  const products = await db
    .selectDistinctOn([ProductsTable.id], {
      id: ProductsTable.id,
      title: ProductsTable.title,
      description: ProductsTable.description,
      imageUrl: ProductsTable.imageUrl,
      priceInCents: ProductsTable.priceInCents,
      createdAt: ProductsTable.createdAt,
      status: ProductsTable.status,
      owner: {
        name: UsersTable.name,
        imageUrl: UsersTable.imageUrl,
      },
      totalComments: sql<number>`count(${CommentsTable.id})`,
    })
    .from(ProductsTable)
    .leftJoin(
      ProductsToCategoriesTable,
      eq(ProductsToCategoriesTable.productId, ProductsTable.id),
    )
    .leftJoin(UsersTable, eq(UsersTable.id, ProductsTable.userId))
    .leftJoin(CommentsTable, eq(CommentsTable.productId, ProductsTable.id))
    .where(whereCondition)
    .limit(limit)
    .offset(offset)
    .groupBy(ProductsTable.id, UsersTable.name, UsersTable.imageUrl);

  const [{ total: totalProducts = 0 } = {}] = await db
    .select({
      total: sql<number>`count(distinct ${ProductsTable.id})`,
    })
    .from(ProductsTable)
    .leftJoin(
      ProductsToCategoriesTable,
      eq(ProductsToCategoriesTable.productId, ProductsTable.id),
    )
    .where(whereCondition);

  const totalPages = Math.ceil(totalProducts / limit);
  return {
    products,
    totalProducts,
    totalPages,
  };
};

export const getMyProducts = async (userId: string) => {
  return await db.query.ProductsTable.findMany({
    with: { owner: true },
    where: eq(ProductsTable.userId, userId),
  });
};
