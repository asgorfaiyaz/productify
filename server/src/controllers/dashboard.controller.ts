import type { Request, Response } from "express";
import handleAsync from "../utils/handleAsync.js";
import {
  createCategoryFromDashboard,
  getDashboardCategoriesFromService,
  getDashboardProductsFromService,
  getDashboardSalesFromService,
  getDashboardUsersFromService,
} from "../services/dashboard.service.js";
import {
  createUserFromDashboard,
  deleteUser,
  getClerkIdByUserId,
} from "../services/user.service.js";
import { getParam } from "../utils/getParam.js";

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
    const { users, totalPages, totalUsers } =
      await getDashboardUsersFromService(page, limit);
    return res.status(200).json({ users, totalPages, totalUsers });
  },
);

export const getDashboardSales = handleAsync(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { sales, totalSales, totalPages } =
      await getDashboardSalesFromService(page, limit);
    return res.status(200).json({ sales, totalSales, totalPages });
  },
);

export const getDashboardCategories = handleAsync(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { categories, totalCategories, totalPages } =
      await getDashboardCategoriesFromService(page, limit);
    return res.status(200).json({
      categories,
      totalCategories,
      totalPages,
    });
  },
);

export const createDashboardUser = handleAsync(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      return res
        .status(400)
        .json({ error: "failed to create user, invalid input" });
    }
    const user = await createUserFromDashboard({ firstName, lastName, email });
    res.status(201).json(user);
  },
);
export const createDashboardCategory = handleAsync(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ error: "failed to create category, invalid input" });
    }
    const category = await createCategoryFromDashboard(name);
    res.status(201).json(category);
  },
);

export const deleteDashboardUser = handleAsync(
  async (req: Request, res: Response) => {
    const id = getParam(req.params.id);
    if (!id)
      return res
        .status(400)
        .json({ error: "failed to create user, invalid input" });
    const clerkId = await getClerkIdByUserId(id);
    await deleteUser(clerkId);
    res.status(200).json({ success: true });
  },
);
