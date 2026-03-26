// pages/AuthCallbackPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthRole } from "@/hooks/useAuthReq";
import { useAuth } from "@clerk/clerk-react";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const role = useAuthRole();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate("/auth/signin");
      return;
    }
    console.log(role);
    if (role === "admin" || role === "guest") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [isLoaded, isSignedIn, role, navigate]);

  // Show a spinner while resolving
  return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
}

export default AuthCallbackPage;
