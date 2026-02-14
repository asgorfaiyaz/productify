import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

export const GuestLoginButton = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const loginAsGuest = async () => {
    if (!isLoaded) return;

    try {
      // 1. Start the sign-in process with the guest credentials
      const result = await signIn.create({
        identifier: "guestuser@gmail.com", // The email you created
        password: "Guest2026", // The password you created
      });

      // 2. If successful, set the session as active
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // 3. Send them straight to the dashboard!
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Guest login failed:", err);
    }
  };

  return (
    <button onClick={loginAsGuest} className="btn btn-primary btn-sm">
      Guest Mode
    </button>
  );
};
