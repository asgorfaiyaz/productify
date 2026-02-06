import type { Request, Response } from "express";
import handleAsync from "../utils/handleAsync.js";
import {
  getDashboardProductsFromService,
  getDashboardUsersFromService,
} from "../services/dashboard.service.js";

export const getDashboardProducts = handleAsync(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { products, totalPages, totalProducts } =
      await getDashboardProductsFromService(page, limit);
    return res.status(200).json({ products, totalPages, totalProducts });
  },
);

export const getDashboardUsers = handleAsync(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { users, totalPages, totalProducts } =
      await getDashboardUsersFromService(page, limit);
    return res.status(200).json({ users, totalPages, totalProducts });
  },
);
