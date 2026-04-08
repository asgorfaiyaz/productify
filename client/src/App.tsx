import { Navigate, Route, Routes, useLocation } from "react-router";
import { useAuthReq, useAuthRole } from "./hooks/useAuthReq";

import DashboardLayout from "./dashboard/pages/DashboardLayout";
import CustomerLayout from "./components/CustomerLayout";
import AuthLayout from "./components/AuthLayout";
import ProductsLayout from "./components/ProductsLayout";

function App() {
  const { isSignedIn, isClerkLoaded } = useAuthReq();
  const userRole = useAuthRole();
  const location = useLocation();
  if (!isClerkLoaded) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <Routes>
        <Route
          path="/auth/*"
          element={
            isSignedIn && location.pathname !== "/auth/callback" ? (
              <Navigate to="/" />
            ) : (
              <AuthLayout />
            )
          }
        />
        {/* Dashboard routes with DashboardNavbar */}
        <Route
          path="/dashboard/*"
          element={
            isSignedIn && userRole && userRole !== "user" ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/browse/*" element={<CustomerLayout />} />
        <Route path="/*" element={<ProductsLayout />} />
      </Routes>
    </div>
  );
}

export default App;
