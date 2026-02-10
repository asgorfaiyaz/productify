import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { SignInButton, SignUpButton, useAuth } from "@clerk/clerk-react";

import { ShoppingBagIcon, LayoutDashboardIcon, Menu } from "lucide-react";
import { Cart } from "./Cart";
import { useIsAdmin } from "@/hooks/useAuthReq";
import { useSidebar } from "./ui/sidebar";

function Navbar() {
  const { isSignedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const { toggleSidebar } = useSidebar();

  const closeMenu = () => setMenuOpen(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenu();
  };

  return (
    <nav className="bg-base-300 shadow-md sticky top-0 z-50">
      <div className="mx-auto w-full px-4">
        {/* MAIN BAR */}
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 btn btn-ghost px-2 hover:bg-transparent"
            onClick={closeMenu}
          >
            <ShoppingBagIcon className="w-5 h-5 text-primary shrink-0" />
            <span className="text-base sm:text-lg font-bold font-mono uppercase tracking-wider">
              Productify
            </span>
          </Link>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex gap-2 items-center">
            {/* <ThemeSelector /> */}

            {isSignedIn ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      to="/dashboard"
                      className="btn btn-ghost btn-sm gap-1"
                    >
                      <LayoutDashboardIcon className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </>
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
          <div className="lg:hidden flex gap-6 justify-end items-center">
            <Cart />
            {/* MOBILE HAMBURGER */}
            <button
              onClick={() => toggleSidebar()}
              className="lg:hidden btn btn-ghost btn-square btn-sm"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-3 space-y-2 border-t border-base-content/10">
            {isSignedIn ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => handleNavigation("/dashboard")}
                    className="btn btn-ghost w-full justify-start py-3 gap-2"
                  >
                    <LayoutDashboardIcon className="w-4 h-4 shrink-0" />
                    Dashboard
                  </button>
                )}
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button
                    onClick={closeMenu}
                    className="btn btn-primary w-full justify-start py-3"
                  >
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    onClick={closeMenu}
                    className="btn btn-primary w-full justify-start py-3"
                  >
                    Get Started
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
