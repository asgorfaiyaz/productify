import { getCustomerCategoriesFromService } from "../services/category.service.js";
import handleAsync from "../utils/handleAsync.js";
import type { Request, Response } from "express";

export const getCustomerCategories = handleAsync(
  async (req: Request, res: Response) => {
    const categories = await getCustomerCategoriesFromService();
    return res.status(200).json(categories);
  },
);
