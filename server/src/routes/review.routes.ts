import { requireAuth } from "@clerk/express";
import express from "express";
import { requireUser } from "../middlewares/requireUser.js";
import {
  createReview,
  deleteReview,
} from "../controllers/review.controller.js";
const router = express.Router();

router.post("/:productId", requireAuth(), requireUser, createReview);
router
  .route("/:reviewId/product/:productId")
  .delete(requireAuth(), requireUser, deleteReview);

export default router;
