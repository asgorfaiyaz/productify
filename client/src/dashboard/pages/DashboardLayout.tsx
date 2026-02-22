import { Route, Routes } from "react-router";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardPage from "./DashboardPage";
import DashboardSales from "./DashboardSales";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./sidebar/DashboardSidebar";
import { DashboardUsers } from "./DashboardUsers";
import { DashboardProducts } from "./DashboardProducts";
import { useAuthRole } from "@/hooks/useAuthReq";
import { DashboardCategories } from "./DashboardCategories";
import DashboardCreateUserPage from "./DashboardCreateUserPage";
import DashboardCreateProductPage from "@/pages/CreatePage";
import { DashboardCreateCategoryPage } from "./CreateCategory";

function DashboardLayout() {
  const role = useAuthRole();
  if (role === "user") return null;
  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <main className="mx-auto px-4 py-6">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<DashboardProducts />} />
            <Route
              path="products/create"
              element={<DashboardCreateProductPage />}
            />
            <Route path="categories" element={<DashboardCategories />} />
            <Route
              path="categories/create"
              element={<DashboardCreateCategoryPage />}
            />
            <Route path="users" element={<DashboardUsers />} />
            <Route path="users/create" element={<DashboardCreateUserPage />} />
            <Route path="sales" element={<DashboardSales />} />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
