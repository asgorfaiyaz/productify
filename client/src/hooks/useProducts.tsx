import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  fetchMyProducts,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from "../api/products";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["products", "dashboardproducts"],
      });
    },
  });
}

export function useProducts({
  page,
  limit,
  categoryId,
  search,
}: {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
}) {
  return useQuery({
    queryFn: () => fetchProducts({ page, limit, categoryId, search }),
    queryKey: ["products", page, limit, categoryId, search],
  });
}
export function useMyProducts() {
  return useQuery({
    queryFn: fetchMyProducts,
    queryKey: ["myproducts"],
  });
}
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
};
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product", variable.productId],
      });
    },
  });
};
