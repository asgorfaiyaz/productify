import { createContext, useContext } from "react";

export type cartItem = { id: string; quantity: number };

type ShoppingCartContext = {
  cartItems: cartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
};
export const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}
