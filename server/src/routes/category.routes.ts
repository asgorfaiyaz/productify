import { requireAuth } from "@clerk/express";
import express from "express";
import {
  getCategoriesByProductId,
  getCustomerCategories,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getCustomerCategories);
router.get("/:productId", requireAuth(), getCategoriesByProductId);

export default router;
