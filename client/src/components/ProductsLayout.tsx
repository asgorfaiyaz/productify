import { Route, Routes } from "react-router";
import Navbar from "./Navbar";
import CustomerSidebar from "@/pages/CustomerSidebar";
import { SidebarProvider } from "./ui/sidebar";
import ProductsPage from "@/pages/ProductsPage";

function ProductsLayout() {
  return (
    <>
      <SidebarProvider>
        <div className="w-full flex">
          <CustomerSidebar />
          <div className="flex-1">
            <Navbar />
            <main className="mx-auto w-full p-6">
              <Routes>
                <Route index element={<ProductsPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

export default ProductsLayout;
