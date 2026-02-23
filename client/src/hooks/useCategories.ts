import {
  fetchCategoriesByProductId,
  fetchCustomerCategories,
} from "@/api/categories";
import { useQuery } from "@tanstack/react-query";

export function useCustomerCategories() {
  return useQuery({
    queryFn: fetchCustomerCategories,
    queryKey: ["customercategories"],
  });
}
export function useCategoriesByProductId(productId: string) {
  return useQuery({
    queryFn: () => fetchCategoriesByProductId(productId),
    queryKey: ["categories", productId],
  });
}
