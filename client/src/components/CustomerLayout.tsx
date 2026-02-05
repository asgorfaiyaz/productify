import { Navigate, Route, Routes } from "react-router";
import Navbar from "./Navbar";
import { useUser } from "@clerk/clerk-react";
import HomePage from "@/pages/HomePage";
import OrdersPage from "@/pages/OrdersPage";
import { PaymentSuccessPage } from "@/pages/PaymentSuccessPage";
import { PaymentCancelPage } from "@/pages/PaymentCancelPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import ProfilePage from "@/pages/ProfilePage";
import EditProductPage from "@/pages/EditProductPage";
import { useIsAdmin } from "@/hooks/useAuthReq";

function CustomerLayout() {
  const { isSignedIn } = useUser();
  const isAdmin = useIsAdmin();

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/orders"
            element={isSignedIn ? <OrdersPage /> : <Navigate to="/" />}
          />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route
            path="/profile"
            element={isSignedIn ? <ProfilePage /> : <Navigate to="/" />}
          />
          <Route
            path="/edit/:id"
            element={isAdmin ? <EditProductPage /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
    </>
  );
}

export default CustomerLayout;
