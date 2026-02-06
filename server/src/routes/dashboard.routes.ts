import { requireAuth } from "@clerk/express";
import express from "express";
import { requireUser } from "../middlewares/requireUser.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import {
  getDashboardProducts,
  getDashboardUsers,
} from "../controllers/dashboard.controller.js";
const router = express.Router();

router
  .route("/products")
  .get(requireAuth(), requireUser, requireAdmin, getDashboardProducts);

router
  .route("/users")
  .get(requireAuth(), requireUser, requireAdmin, getDashboardUsers);

export default router;
