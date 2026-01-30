import {
  ShoppingCartContext,
  type cartItem,
} from "@/context/shoppingCartContext";
import { useState, type ReactNode } from "react";

export default function ShoppingCartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  console.log(cartItems);

  const addToCart = (id: string) => {
    const isItemAvailable = cartItems.find((i) => i.id === id);
    if (!isItemAvailable) {
      setCartItems((cartItems) => {
        return [...cartItems, { id, quantity: 1 }];
      });
    } else {
      setCartItems((cartItems) => {
        return cartItems.map((item) => {
          if (item.id === id) {
            return { id, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      });
    }
  };
  const removeFromCart = (id: string) => {
    setCartItems((cartItems) => {
      const currentItm = cartItems.find((it) => it.id == id)?.quantity == 1;
      if (currentItm) {
        return cartItems.filter((i) => i.id !== id);
      }
      return cartItems.map((item) => {
        if (item.id === id) {
          return { id, quantity: item.quantity - 1 };
        } else {
          return item;
        }
      });
    });
  };

  return (
    <ShoppingCartContext.Provider
      value={{ addToCart, removeFromCart, cartItems }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
