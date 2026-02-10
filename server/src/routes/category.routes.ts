import { requireAuth } from "@clerk/express";
import express from "express";
import { getCustomerCategories } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getCustomerCategories);

export default router;
