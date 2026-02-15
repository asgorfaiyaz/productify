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
  getDashboardSalesByDate,
  getDashboardUsers,
} from "../controllers/dashboard.controller.js";
import { attachRole } from "../middlewares/attachRole.js";
const router = express.Router();

router
  .route("/products")
  .get(requireAuth(), requireUser, attachRole, getDashboardProducts);

router
  .route("/sales")
  .get(requireAuth(), requireUser, attachRole, getDashboardSales);
router
  .route("/sales/by-date")
  .get(requireAuth(), requireUser, attachRole, getDashboardSalesByDate);

router
  .route("/users")
  .get(requireAuth(), requireUser, attachRole, getDashboardUsers)
  .post(requireAuth(), requireUser, requireAdmin, createDashboardUser);

router
  .route("/categories")
  .get(requireAuth(), requireUser, attachRole, getDashboardCategories)
  .post(requireAuth(), requireUser, requireAdmin, createDashboardCategory);

router
  .route("/users/:id")
  .delete(requireAuth(), requireUser, requireAdmin, deleteDashboardUser);

export default router;
