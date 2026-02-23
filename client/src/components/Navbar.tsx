import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import {
  ShoppingBagIcon,
  LayoutDashboardIcon,
  Menu,
  Search,
  X,
} from "lucide-react";

import { Cart } from "./Cart";
import { useAuthRole } from "@/hooks/useAuthReq";
import { useSidebar } from "./ui/sidebar";
import { Input } from "@/components/ui/input";
import { useFilterStore } from "@/store/filter-store";
import { GuestLoginButton } from "./GuestLogin";
import { useAuthStore } from "@/store/auth-store";

function Navbar() {
  const { filters, setFilters } = useFilterStore();
  const { isSignedIn } = useAuth();
  const { isAuthLoading } = useAuthStore();
  const role = useAuthRole();
  const { toggleSidebar } = useSidebar();
  const [forceShowSearch, setForceShowSearch] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasScrolledRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setForceShowSearch(false);
      }
    };

    if (forceShowSearch) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [forceShowSearch]);

  return (
    <nav ref={navbarRef} className="bg-base-300 shadow-md sticky top-0 z-50">
      <div className="mx-auto w-full px-4">
        {/* MAIN BAR */}
        <div className="flex items-center h-16 gap-4">
          {/* LOGO / MOBILE SEARCH */}
          {!forceShowSearch ? (
            <Link
              to="/"
              className="flex items-center gap-2 btn btn-ghost px-2 hover:bg-transparent"
            >
              <ShoppingBagIcon className="w-5 h-5 text-primary shrink-0" />
              <span className="text-base sm:text-lg font-bold font-mono uppercase tracking-wider">
                Productify
              </span>
            </Link>
          ) : (
            // MOBILE SEARCH INPUT
            <div className="flex-1 lg:hidden relative w-full flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  autoFocus
                  value={filters.search}
                  onFocus={() => {
                    if (!hasScrolledRef.current) {
                      document
                        .getElementById("products")
                        ?.scrollIntoView({ behavior: "auto" });

                      hasScrolledRef.current = true;
                    }
                  }}
                  onChange={(e) => {
                    if (location.pathname !== "/") {
                      navigate("/");
                    }
                    setFilters({
                      search: e.target.value,
                      categoryId: undefined,
                      page: 1,
                    });
                  }}
                  placeholder="Search products..."
                  className="pl-9 h-10 w-full rounded-full"
                />
              </div>
              <button
                onClick={() => setForceShowSearch(false)}
                className="btn btn-ghost btn-square btn-sm"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* DESKTOP SEARCH */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={filters.search}
                onFocus={() => {
                  if (!hasScrolledRef.current) {
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "auto" });

                    hasScrolledRef.current = true;
                  }
                }}
                onChange={(e) => {
                  if (location.pathname !== "/") {
                    navigate("/");
                  }
                  setFilters({
                    search: e.target.value,
                    categoryId: undefined,
                    page: 1,
                  });

                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "auto" });
                }}
                placeholder="Search products..."
                className="pl-9 h-9 outline-none rounded-full"
              />
            </div>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex gap-2 items-center ml-auto">
            {isSignedIn ? (
              <>
                {role !== "user" && (
                  <Link to="/dashboard" className="btn btn-ghost btn-sm gap-1">
                    <LayoutDashboardIcon className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                <Cart />
              </>
            ) : (
              <>
                <Cart />
                <SignInButton mode="modal">
                  <button
                    disabled={isAuthLoading}
                    className="btn ml-5 btn-primary btn-sm"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <GuestLoginButton />
              </>
            )}
          </div>

          {/* MOBILE */}
          <div className="lg:hidden flex gap-4 items-center ml-auto">
            {/* SEARCH BUTTON */}
            {!forceShowSearch && (
              <button
                onClick={() => setForceShowSearch(true)}
                className="btn btn-ghost btn-square btn-sm"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <Cart />

            <button
              onClick={toggleSidebar}
              className="md:hidden btn btn-ghost btn-square btn-sm"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
