import {
  getCategoriesByProductIdFromService,
  getCustomerCategoriesFromService,
} from "../services/category.service.js";
import { getParam } from "../utils/getParam.js";
import handleAsync from "../utils/handleAsync.js";
import type { Request, Response } from "express";

export const getCustomerCategories = handleAsync(
  async (req: Request, res: Response) => {
    const categories = await getCustomerCategoriesFromService();
    return res.status(200).json(categories);
  },
);
export const getCategoriesByProductId = handleAsync(
  async (req: Request, res: Response) => {
    const productId = getParam(req.params.productId);
    if (!productId) {
      return res.status(400).send("Product ID is required");
    }
    const categories = await getCategoriesByProductIdFromService(productId);
    return res.status(200).json(categories);
  },
);
