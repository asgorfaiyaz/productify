import { fetchDashboardProducts, fetchDashboardUsers } from "@/api/dashboards";
import { useQuery } from "@tanstack/react-query";

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
