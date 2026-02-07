import { requireAuth } from "@clerk/express";
import express from "express";
import { requireUser } from "../middlewares/requireUser.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import {
  createDashboardCategory,
  createDashboardUser,
  deleteDashboardUser,
  getDashboardCategories,
  getDashboardProducts,
  getDashboardSales,
  getDashboardUsers,
} from "../controllers/dashboard.controller.js";
const router = express.Router();

router
  .route("/products")
  .get(requireAuth(), requireUser, requireAdmin, getDashboardProducts);

router
  .route("/sales")
  .get(requireAuth(), requireUser, requireAdmin, getDashboardSales);

router
  .route("/users")
  .get(requireAuth(), requireUser, requireAdmin, getDashboardUsers)
  .post(requireAuth(), requireUser, requireAdmin, createDashboardUser);

router
  .route("/categories")
  .get(requireAuth(), requireUser, requireAdmin, getDashboardCategories)
  .post(requireAuth(), requireUser, requireAdmin, createDashboardCategory);

router
  .route("/users/:id")
  .delete(requireAuth(), requireUser, requireAdmin, deleteDashboardUser);

export default router;
