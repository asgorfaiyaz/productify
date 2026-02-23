import type { Request, Response } from "express";
import handleAsync from "../utils/handleAsync.js";
import { getParam } from "../utils/getParam.js";
import { createReviewSchema } from "../schemas/review.schema.js";
import {
  deleteReviewForProduct,
  insertReview,
} from "../services/review.service.js";

export const createReview = handleAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;

  const parsedData = createReviewSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res
      .status(400)
      .json({ error: "Invalid input data for creating Review" });
  }

  const productId = getParam(req.params.productId);
  if (!productId) {
    return res.status(400).json({
      error: "Product ID is required",
    });
  }

  const { content, rating } = parsedData.data;

  const review = await insertReview(productId, userId, content, rating);
  return res.status(201).json(review);
});

export const deleteReview = handleAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;

  const productId = getParam(req.params.productId);
  const reviewId = getParam(req.params.reviewId);
  if (!productId) {
    return res.status(400).send("Product ID is required");
  }
  if (!reviewId) {
    return res.status(400).send("review ID is required");
  }

  await deleteReviewForProduct(reviewId, productId, userId);
  return res.status(200).send("review deleted successfully");
});
