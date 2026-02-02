import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import CartItemCard from "./CartItemCard";

export function Cart() {
  const { cartItems, addToCart, removeFromCart } = useCartStore();

  // ✅ Derived values (best practice)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.1; // 10% tax (example)
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + tax + shipping;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-full border hover:bg-muted transition">
          <ShoppingCart size={16} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="flex flex-col border-none">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Review your selected items before checkout.
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-center">
              Your cart is empty
            </p>
          ) : (
            cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                price={item.price}
                quantity={item.quantity}
                onAdd={addToCart}
                onRemove={removeFromCart}
                onDelete={removeFromCart}
              />
            ))
          )}
        </div>

        {/* 🧾 Order Summary */}
        {cartItems.length > 0 && (
          <div className="pt-4 space-y-2 text-sm px-5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Items ({totalItems})
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-base border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <SheetFooter className="mt-4 flex-col gap-2">
          <Button asChild disabled={cartItems.length === 0} className="w-full">
            <Link to="/checkout">Checkout</Link>
          </Button>

          <SheetClose asChild>
            <Button variant="outline" className="w-full bg-base-300">
              Continue Shopping
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
