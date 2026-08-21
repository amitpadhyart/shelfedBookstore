import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  bookId: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  coverUrl: string;
  format: string;
  stock: number;
  quantity: number;
}

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  replaceCart: (items: CartLine[]) => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.bookId === item.bookId);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, item.stock);
            return {
              items: state.items.map((i) =>
                i.bookId === item.bookId ? { ...i, quantity: nextQty } : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(quantity, item.stock) }],
          };
        });
      },

      removeItem: (bookId) => {
        set((state) => ({ items: state.items.filter((i) => i.bookId !== bookId) }));
      },

      updateQuantity: (bookId, quantity) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.bookId === bookId
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [] }),
      replaceCart: (items) => set({ items }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "shelfed-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
