import { createReview, deleteReview } from "@/api/reviews";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (_, variable) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["product", variable.productId],
      });
    },
  });
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: (_, variable) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["product", variable.productId],
      });
    },
  });
};
