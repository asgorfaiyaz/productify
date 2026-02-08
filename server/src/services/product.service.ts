import { eq, inArray, sql } from "drizzle-orm";
import type { z } from "zod";
import { ProductsTable, UsersTable } from "../db/schema.js";
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
  const { price, ...rest } = data;
  const [product] = await db
    .insert(ProductsTable)
    .values({ ...rest, userId, priceInCents: Math.round(price * 100) })
    .returning();
  return product;
};

export const updateProductById = async (
  productId: string,
  data: UpdateProductInput,
) => {
  const { price, ...rest } = data;

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

export const getAllProducts = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const products = await db.query.ProductsTable.findMany({
    with: {
      owner: {
        columns: {
          name: true,
          imageUrl: true,
        },
      },
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

export const getMyProducts = async (userId: string) => {
  return await db.query.ProductsTable.findMany({
    with: { owner: true },
    where: eq(ProductsTable.userId, userId),
  });
};
