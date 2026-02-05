import { Route, Routes } from "react-router";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardPage from "./DashboardPage";
import DashboardProducts from "./DashboardProducts";
import DashboardSales from "./DashboardSales";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./sidebar/DashboardSidebar";
import CreatePage from "@/pages/CreatePage";

function DashboardLayout() {
  return (
    <SidebarProvider>
      <section className="flex w-full">
        <DashboardSidebar />
        <section className="flex-1">
          <DashboardNavbar />
          <main className="mx-auto px-4 py-6">
            <Routes>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<DashboardProducts />} />
              <Route path="products/create" element={<CreatePage />} />
              <Route path="sales" element={<DashboardSales />} />
            </Routes>
          </main>
        </section>
      </section>
    </SidebarProvider>
  );
}

export default DashboardLayout;
