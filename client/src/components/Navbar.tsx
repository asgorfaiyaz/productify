import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { SignInButton, SignUpButton, useAuth } from "@clerk/clerk-react";
import {
  ShoppingBagIcon,
  LayoutDashboardIcon,
  Menu,
  Search,
  X,
} from "lucide-react";

import { Cart } from "./Cart";
import { useIsAdmin } from "@/hooks/useAuthReq";
import { useSidebar } from "./ui/sidebar";
import { Input } from "@/components/ui/input";
import { useFilterStore } from "@/store/filter-store";

function Navbar() {
  const { filters, setFilters } = useFilterStore();
  const { isSignedIn } = useAuth();
  const isAdmin = useIsAdmin();
  const { toggleSidebar } = useSidebar();
  const [forceShowSearch, setForceShowSearch] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const handleSearchChange = (value: string) => {
    setFilters({
      search: value,
      categoryId: undefined,
      page: 1,
    });

    // Scroll to products section if it exists
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products..."
                className="pl-9 h-9 outline-none rounded-full"
              />
            </div>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex gap-2 items-center ml-auto">
            {isSignedIn ? (
              <>
                {isAdmin && (
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
                  <button className="btn ml-5 btn-primary btn-sm">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn btn-primary btn-sm">
                    Get Started
                  </button>
                </SignUpButton>
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
