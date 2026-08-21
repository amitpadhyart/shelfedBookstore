import type { Book as PrismaBook, Format, OrderStatus } from "@prisma/client";

export type Book = PrismaBook;
export type { Format, OrderStatus };

export const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Sci-Fi",
  "Romance",
  "Self-Help",
  "Classics",
  "Children's",
] as const;

export type Genre = (typeof GENRES)[number];

export const MOODS: { key: string; label: string; blurb: string }[] = [
  {
    key: "slow-sunday",
    label: "If you liked a slow Sunday morning…",
    blurb: "Unhurried books for when there's nowhere to be.",
  },
  {
    key: "big-ideas",
    label: "Big ideas, best read before bed",
    blurb: "The kind of books that rearrange how you think, slowly.",
  },
  {
    key: "edge-of-seat",
    label: "For when you want to miss your stop",
    blurb: "Pacy, propulsive, hard to put down.",
  },
  {
    key: "heart-on-sleeve",
    label: "Bring tissues, just in case",
    blurb: "Books that ask a little more of your heart.",
  },
  {
    key: "quiet-corner",
    label: "A quiet corner, a good lamp",
    blurb: "Literary, unhurried, built to be reread.",
  },
  {
    key: "rainy-day",
    label: "Rainy-day comfort reads",
    blurb: "For the sound of rain on a window and nothing to do.",
  },
];

export type SortOption =
  | "newest"
  | "bestselling"
  | "az"
  | "za"
  | "price-asc"
  | "price-desc"
  | "rating";

export interface CatalogFilters {
  q?: string;
  genre?: string;
  format?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: SortOption;
  page?: number;
}
