import axiosInstance from "../lib/axios";

export const createReview = async ({
  productId,
  content,
  rating,
}: {
  productId: string;
  content: string;
  rating: number;
}) => {
  const response = await axiosInstance.post(`/reviews/${productId}`, {
    content,
    rating,
  });
  return response.data as {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    content: string;
    rating: number;
    productId: string;
  };
};
export const deleteReview = async ({
  reviewId,
  productId,
}: {
  reviewId: string;
  productId: string;
}) => {
  const response = await axiosInstance.delete(
    `/reviews/${reviewId}/product/${productId}`,
  );
  return response.data;
};
