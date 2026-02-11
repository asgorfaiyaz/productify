import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { ProductsToCategoriesTable } from "../db/schema.js";

export const getCustomerCategoriesFromService = async () => {
  return await db.query.CategoriesTable.findMany({
    columns: {
      id: true,
      name: true,
      createdAt: true,
    },
  });
};
export const getCategoriesByProductIdFromService = async (
  productId: string,
) => {
  const categories = await db.query.ProductsToCategoriesTable.findMany({
    where: eq(ProductsToCategoriesTable.productId, productId),
    with: {
      category: {
        columns: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
    },
  });
  return categories.map((c) => c.category);
};
