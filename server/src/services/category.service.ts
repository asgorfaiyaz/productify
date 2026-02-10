import db from "../db/index.js";

export const getCustomerCategoriesFromService = async () => {
  return await db.query.CategoriesTable.findMany({
    columns: {
      id: true,
      name: true,
      createdAt: true,
    },
  });
};
