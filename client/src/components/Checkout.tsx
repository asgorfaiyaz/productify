import { ShoppingBagIcon, CreditCardIcon, LockIcon } from "lucide-react";

function Checkout() {
  return (
    <div className="h-full bg-base-300 min-h-[84vh] w-full  shadow-xl flex items-center justify-center px-4">
      <div className="w-full bg-base-300 h-full rounded-2xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <ShoppingBagIcon className="size-8" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">Checkout Coming Soon</h1>

        {/* Description */}
        <p className="text-center text-base-content/70 mt-2">
          We’re putting the finishing touches on a secure and seamless checkout
          experience.
        </p>

        {/* Feature hints */}
        <div className="mt-10 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-base-content/80">
            <CreditCardIcon className="size-4 text-primary" />
            Secure online payments
          </div>
          <div className="flex items-center gap-2 text-base-content/80">
            <LockIcon className="size-4 text-primary" />
            Encrypted & protected checkout
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-xs text-base-content/50">
          🚀 Launching very soon. Thank you for your patience.
        </div>
      </div>
    </div>
  );
}

export default Checkout;
