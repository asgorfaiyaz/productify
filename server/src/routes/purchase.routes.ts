import express from "express";
import { createOrder } from "../controllers/purchase.controller.js";
import { requireUser } from "../middlewares/requireUser.js";
import { requireAuth } from "@clerk/express";
const router = express.Router();

router
  .route("/:productId/purchase")
  .post(requireAuth(), requireUser, createOrder);

export default router;
