import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { useNavigate } from "react-router";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

export function ClerkWithRouter({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        elements: {
          card: {
            background: "none",
          },
          footer: {
            background: "none",
          },
          cardBox: {
            border: "none",
            borderRadius: 0,
            boxShadow: "none",
          },
        },
      }}
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/auth/signin"
      signUpUrl="/auth/signup"
      signInForceRedirectUrl="/auth/callback" // 👈 static URL
      signUpForceRedirectUrl="/auth/callback"
    >
      {children}
    </ClerkProvider>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkWithRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkWithRouter>
    </BrowserRouter>
  </StrictMode>,
);
