import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type cartItem = {
  id: string;
  quantity: number;
  title: string;
  description: string;
  price: number;
};

type CartStore = {
  cartItems: cartItem[];
  addToCart: (item: cartItem) => void;
  removeFromCart: (id: string) => void;
  clearCartItems: () => void;
};
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (item) => {
        const existingItem = get().cartItems.find((i) => i.id === item.id);
        if (!existingItem) {
          return set({ cartItems: [...get().cartItems, item] });
        } else {
          set({
            cartItems: get().cartItems.map((itm) => {
              if (itm.id === existingItem.id) {
                return { ...itm, quantity: itm.quantity + 1 };
              }
              return itm;
            }),
          });
        }
      },
      removeFromCart: (id) => {
        const existingItem = get().cartItems.find((i) => i.id === id);
        if (existingItem) {
          if (existingItem.quantity <= 1) {
            return set({
              cartItems: get().cartItems.filter((i) => i.id !== id),
            });
          } else {
            set({
              cartItems: get().cartItems.map((itm) => {
                if (itm.id === existingItem.id) {
                  return { ...itm, quantity: itm.quantity - 1 };
                }
                return itm;
              }),
            });
          }
        }
      },
      clearCartItems: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
