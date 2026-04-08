import { Navigate, Route, Routes } from "react-router";
import { useUser } from "@clerk/clerk-react";
import OrdersPage from "@/pages/OrdersPage";
import { PaymentSuccessPage } from "@/pages/PaymentSuccessPage";
import { PaymentCancelPage } from "@/pages/PaymentCancelPage";
import ProfilePage from "@/pages/ProfilePage";
import EditProductPage from "@/pages/EditProductPage";
import { useIsAdmin } from "@/hooks/useAuthReq";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import CustomerNavbar from "./CustomerNavbar";

function CustomerLayout() {
  const { isSignedIn } = useUser();
  const isAdmin = useIsAdmin();
  return (
    <>
      <CustomerNavbar />
      <main className="mx-auto w-full p-6">
        <Routes>
          <Route
            path="orders"
            element={isSignedIn ? <OrdersPage /> : <Navigate to="/" />}
          />
          <Route path="payment/success" element={<PaymentSuccessPage />} />
          <Route path="payment/cancel" element={<PaymentCancelPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route
            path="profile"
            element={isSignedIn ? <ProfilePage /> : <Navigate to="/" />}
          />
          <Route
            path="edit/:id"
            element={isAdmin ? <EditProductPage /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
    </>
  );
}

export default CustomerLayout;
