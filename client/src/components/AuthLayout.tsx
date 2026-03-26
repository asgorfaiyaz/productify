import { Navigate, Route, Routes, useLocation } from "react-router";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import { GuestLoginButton } from "./GuestLogin";

function AuthLayout() {
  const location = useLocation();
  return (
    <div className="w-full bg-base-200 flex flex-col lg:justify-center lg:flex-row min-h-screen">
      {/* Decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-base-200 sticky top-0 h-screen overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 p-12 text-center max-w-md">
          {/* Badge */}
          <span className="px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
            New arrivals every week
          </span>

          {/* Title */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Your World-Class{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-400">
              Shopping Hub
            </span>
          </h1>

          {/* Description */}
          <p className="text-base-content/60 text-sm leading-relaxed">
            Discover thousands of premium products — from everyday essentials to
            exclusive deals. Shop smarter, save bigger, and enjoy a seamless
            experience built just for you.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-violet-400">10k+</span>
              <span className="text-xs text-base-content/50">Products</span>
            </div>
            <div className="w-px bg-base-content/10" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-indigo-400">50k+</span>
              <span className="text-xs text-base-content/50">
                Happy Customers
              </span>
            </div>
            <div className="w-px bg-base-content/10" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-violet-400">4.9★</span>
              <span className="text-xs text-base-content/50">Rating</span>
            </div>
          </div>

          {/* Illustration */}
          <div className="mt-4 w-full">
            <img
              src="/second.svg"
              alt="Shopping illustration"
              className="w-full max-h-56 object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      <main className="w-full lg:w-1/2 min-h-screen lg:h-screen lg:overflow-y-auto bg-base-200 p-6 flex flex-col items-center justify-center">
        <Routes>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="callback" element={<AuthCallbackPage />} />
          <Route path="*" element={<Navigate to="signin" />} />
        </Routes>
        {/* Only show guest CTA on signin/signup, not callback */}
        {location.pathname !== "/auth/callback" && (
          <div className="flex flex-col items-center gap-2 mt-6 w-full">
            <div className="divider text-xs text-base-content/30">or</div>
            <p className="text-xs text-base-content/40">
              Don't want to create an account?
            </p>
            <GuestLoginButton />
          </div>
        )}
      </main>
    </div>
  );
}

export default AuthLayout;
