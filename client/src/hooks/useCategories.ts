import { fetchCustomerCategories } from "@/api/categories";
import { useQuery } from "@tanstack/react-query";

export function useCustomerCategories() {
  return useQuery({
    queryFn: fetchCustomerCategories,
    queryKey: ["customercategories"],
  });
}
