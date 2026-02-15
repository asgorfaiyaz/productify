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
import { endOfDay, startOfDay, subDays } from "date-fns";
import { getOrdersByDate } from "../services/chart.service.js";

export const getDashboardProducts = handleAsync(
  async (req: Request, res: Response) => {
    if (req.role !== "admin" && req.role !== "guest") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only admin or guest users are allowed." });
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { products, totalPages, totalProducts } =
      await getDashboardProductsFromService(page, limit);
    return res.status(200).json({ products, totalPages, totalProducts });
  },
);

export const getDashboardUsers = handleAsync(
  async (req: Request, res: Response) => {
    if (req.role !== "admin" && req.role !== "guest") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only admin or guest users are allowed." });
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { users, totalPages, totalUsers } =
      await getDashboardUsersFromService(page, limit);
    return res.status(200).json({ users, totalPages, totalUsers });
  },
);

export const getDashboardSales = handleAsync(
  async (req: Request, res: Response) => {
    if (req.role !== "admin" && req.role !== "guest") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only admin or guest users are allowed." });
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { sales, totalSales, totalPages } =
      await getDashboardSalesFromService(page, limit);
    return res.status(200).json({ sales, totalSales, totalPages });
  },
);

// Resolve a named preset → { from, to }
function resolvePreset(preset: string): { from: Date; to: Date } | null {
  const now = new Date();

  const presets: Record<string, { from: Date; to: Date }> = {
    today: { from: startOfDay(now), to: endOfDay(now) },
    yesterday: {
      from: startOfDay(subDays(now, 1)),
      to: endOfDay(subDays(now, 1)),
    },
    "7days": { from: startOfDay(subDays(now, 6)), to: endOfDay(now) },
    "14days": { from: startOfDay(subDays(now, 13)), to: endOfDay(now) },
    "30days": { from: startOfDay(subDays(now, 29)), to: endOfDay(now) },
    "90days": { from: startOfDay(subDays(now, 89)), to: endOfDay(now) },
    this_month: {
      from: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
      to: endOfDay(now),
    },
    last_month: {
      from: startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      to: endOfDay(new Date(now.getFullYear(), now.getMonth(), 0)),
    },
  };

  return presets[preset] ?? null;
}

export async function getDashboardSalesByDate(req: Request, res: Response) {
  if (req.role !== "admin" && req.role !== "guest") {
    return res
      .status(403)
      .json({ error: "Forbidden: Only admin or guest users are allowed." });
  }
  const { preset, from, to } = req.query as Record<string, string>;

  let fromDate: Date;
  let toDate: Date;

  if (preset) {
    const resolved = resolvePreset(preset);
    if (!resolved) {
      return res.status(400).json({ error: `Unknown preset: "${preset}"` });
    }
    fromDate = resolved.from;
    toDate = resolved.to;
  } else if (from && to) {
    // Custom range — client sends ISO strings e.g. "2025-01-01"
    fromDate = new Date(from);
    toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res
        .status(400)
        .json({ error: "Invalid from/to date format. Use ISO 8601." });
    }
    if (fromDate > toDate) {
      return res.status(400).json({ error: "`from` must be before `to`." });
    }
  } else {
    // Default fallback
    fromDate = startOfDay(subDays(new Date(), 6));
    toDate = endOfDay(new Date());
  }

  const data = await getOrdersByDate({ from: fromDate, to: toDate });

  return res.json({ from: fromDate, to: toDate, data });
}

export const getDashboardCategories = handleAsync(
  async (req: Request, res: Response) => {
    if (req.role !== "admin" && req.role !== "guest") {
      return res
        .status(403)
        .json({ error: "Forbidden: Only admin or guest users are allowed." });
    }
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
