import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export const GuestLoginButton = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const { isAuthLoading, setAuthLoading } = useAuthStore();

  const loginAsGuest = async () => {
    if (!isLoaded || isAuthLoading) return;
    try {
      setAuthLoading(true);
      const result = await signIn.create({
        identifier: "guestuser@gmail.com",
        password: "Guest2026",
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Guest login failed:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <button
      onClick={loginAsGuest}
      disabled={isAuthLoading}
      className="btn btn-primary btn-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isAuthLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Guest Mode"
      )}
    </button>
  );
};
