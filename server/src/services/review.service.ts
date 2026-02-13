import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { ReviewsTable } from "../db/schema.js";

export const insertReview = async (
  productId: string,
  userId: string,
  content: string,
  rating: number,
) => {
  const [createReview] = await db
    .insert(ReviewsTable)
    .values({
      productId,
      userId,
      content,
      rating,
    })
    .returning();

  if (!createReview) {
    throw new Error("Failed to create review");
  }

  return createReview;
};
export const deleteReviewForProduct = async (
  reviewId: string,
  productId: string,
  userId: string,
) => {
  const review = await db.query.ReviewsTable.findFirst({
    where: eq(ReviewsTable.id, reviewId),
  });

  if (!review) {
    throw new Error("review not found");
  }

  if (review.productId !== productId) {
    throw new Error("review does not belong to this product");
  }

  if (review.userId !== userId) {
    throw new Error("Forbidden, you are not the author of the review");
  }

  await db.delete(ReviewsTable).where(eq(ReviewsTable.id, reviewId));

  return review;
};
