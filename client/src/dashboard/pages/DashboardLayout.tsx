import { Route, Routes } from "react-router";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardPage from "./DashboardPage";
import DashboardProducts from "./DashboardProducts";
import DashboardSales from "./DashboardSales";

function DashboardLayout() {
  return (
    <>
      <DashboardNavbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="sales" element={<DashboardSales />} />
          {/* Add more dashboard sub-routes here */}
        </Routes>
      </main>
    </>
  );
}

export default DashboardLayout;
