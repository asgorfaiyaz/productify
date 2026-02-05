import { Navigate, Route, Routes } from "react-router";
import { useAuthReq, useIsAdmin } from "./hooks/useAuthReq";

import DashboardLayout from "./dashboard/pages/DashboardLayout";
import CustomerLayout from "./components/CustomerLayout";

function App() {
  const { isSignedIn, isClerkLoaded } = useAuthReq();
  const isAdmin = useIsAdmin();
  if (!isClerkLoaded) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <Routes>
        {/* Dashboard routes with DashboardNavbar */}
        <Route
          path="/dashboard/*"
          element={
            isSignedIn && isAdmin ? <DashboardLayout /> : <Navigate to="/" />
          }
        />

        {/* Main app routes with regular Navbar */}
        <Route path="/*" element={<CustomerLayout />} />
      </Routes>
    </div>
  );
}

export default App;
