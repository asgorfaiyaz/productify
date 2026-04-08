import { Link, useNavigate } from "react-router";
import { ShoppingBagIcon, ArrowLeftIcon } from "lucide-react";

import { Cart } from "./Cart";
import { useAuth } from "@clerk/clerk-react";

function CustomerNavbar() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-base-300 shadow-md sticky top-0 z-50">
      <div className="mx-auto w-full px-4">
        {/* MAIN BAR */}
        <div className="flex items-center h-16 gap-4">
          {/* LOGO / MOBILE SEARCH */}
          <Link
            to="/"
            className="flex items-center gap-2 btn btn-ghost px-2 hover:bg-transparent"
          >
            <ShoppingBagIcon className="w-5 h-5 text-primary shrink-0" />
            <span className="text-base sm:text-lg font-bold font-mono uppercase tracking-wider">
              Productify
            </span>
          </Link>

          <div className="flex gap-2 items-center ml-auto">
            <Cart />
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/");
                }
              }}
              className="btn btn-ghost btn-sm gap-1"
            >
              <ArrowLeftIcon className="size-4" /> Back
            </button>
          </div>
          {!isSignedIn && (
            <>
              <Link to="/auth/signin" className="btn ml-5 btn-primary btn-sm">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default CustomerNavbar;
