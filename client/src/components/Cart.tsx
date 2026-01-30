import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useShoppingCart } from "@/context/shoppingCartContext";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";

export function Cart() {
  const { cartItems, addToCart, removeFromCart } = useShoppingCart();

  const totalItems = cartItems.length;
  // const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-full border hover:bg-muted transition">
          <ShoppingCart size={16} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="flex flex-col border-none">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-center">
              Your cart is empty
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-lg p-3"
              >
                <div className="flex flex-col">
                  <span className="font-medium">Product {item.id}</span>
                  <span className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Minus size={14} />
                  </Button>

                  <span className="w-6 text-center">{item.quantity}</span>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => addToCart(item.id)}
                  >
                    <Plus size={14} />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (item.quantity > 0) {
                        removeFromCart(item.id);
                      }
                    }}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="mt-auto flex-col gap-2">
          <Button asChild disabled={cartItems.length === 0} className="w-full">
            <Link to={"/checkout"}>Checkout</Link>
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
