import {
  createCategory,
  createUser,
  deleteUser,
  fetchDashboardCategories,
  fetchDashboardProducts,
  fetchDashboardSales,
  fetchDashboardUsers,
} from "@/api/dashboards";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDashboardProducts(page: number) {
  return useQuery({
    queryFn: () => fetchDashboardProducts(page),
    queryKey: ["dashboardproducts", page],
  });
}
export function useDashboardUsers(page: number) {
  return useQuery({
    queryFn: () => fetchDashboardUsers(page),
    queryKey: ["dashboardusers", page],
  });
}
export function useDashboardSales(page: number) {
  return useQuery({
    queryFn: () => fetchDashboardSales(page),
    queryKey: ["dashboardsales", page],
  });
}
export function useDashboardCategories(page: number) {
  return useQuery({
    queryFn: () => fetchDashboardCategories(page),
    queryKey: ["dashboardcategories", page],
  });
}

export function useCreateDashboardUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Refresh users list after creation
      queryClient.invalidateQueries({
        queryKey: ["dashboardusers"],
      });
    },
  });
}
export function useCreateDashboardCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      // Refresh users list after creation
      queryClient.invalidateQueries({
        queryKey: ["dashboardcategories"],
      });
    },
  });
}
export function useDeleteDashboardUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Refresh users list after creation
      queryClient.invalidateQueries({
        queryKey: ["dashboardusers"],
      });
    },
  });
}
