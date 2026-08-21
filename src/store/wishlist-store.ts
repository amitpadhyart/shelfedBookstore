import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistBook {
  bookId: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  coverUrl: string;
}

interface WishlistState {
  items: WishlistBook[];
  toggle: (book: WishlistBook) => void;
  isSaved: (bookId: string) => boolean;
  replaceWishlist: (items: WishlistBook[]) => void;
  remove: (bookId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (book) => {
        set((state) => {
          const exists = state.items.some((i) => i.bookId === book.bookId);
          return {
            items: exists
              ? state.items.filter((i) => i.bookId !== book.bookId)
              : [...state.items, book],
          };
        });
      },
      isSaved: (bookId) => get().items.some((i) => i.bookId === bookId),
      replaceWishlist: (items) => set({ items }),
      remove: (bookId) => set((state) => ({ items: state.items.filter((i) => i.bookId !== bookId) })),
    }),
    { name: "shelfed-wishlist" }
  )
);
