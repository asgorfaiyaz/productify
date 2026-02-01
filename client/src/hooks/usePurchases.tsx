import { createOrder, getSalesDataByUserId } from "@/api/purchases";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSalesDataByUser() {
  return useQuery({
    queryFn: getSalesDataByUserId,
    queryKey: ["mypurchases"],
  });
}
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["mypurchases"] });
    },
  });
}
