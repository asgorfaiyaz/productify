import {
  createCategory,
  createUser,
  deleteUser,
  fetchDashboardCategories,
  fetchDashboardOverviewData,
  fetchDashboardProducts,
  fetchDashboardSales,
  fetchDashboardSalesByDate,
  fetchDashboardUsers,
  type DashboardProductsFiltersType,
  type DashboardUsersFiltersType,
  type SalesByDateParams,
} from "@/api/dashboards";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDashboardProducts(filters: DashboardProductsFiltersType) {
  return useQuery({
    queryFn: () => fetchDashboardProducts(filters),
    queryKey: ["dashboardproducts", filters],
  });
}
export function useDashboardOverviewData() {
  return useQuery({
    queryFn: fetchDashboardOverviewData,
    queryKey: ["dashboardoverview"],
  });
}
export function useDashboardUsers(filters: DashboardUsersFiltersType) {
  return useQuery({
    queryFn: () => fetchDashboardUsers(filters),
    queryKey: ["dashboardusers", filters],
  });
}
export function useDashboardSales(page: number) {
  return useQuery({
    queryFn: () => fetchDashboardSales(page),
    queryKey: ["dashboardsales", page],
  });
}

export function useDashboardSalesByDate(params: SalesByDateParams) {
  return useQuery({
    queryKey: ["dashboardSalesByDate", params], // re-fetches when params change
    queryFn: () => fetchDashboardSalesByDate(params),
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
