import { prisma } from "@/lib/prisma";
import type { CatalogFilters, SortOption } from "@/types";
import type { Prisma } from "@prisma/client";

export async function getFeaturedBooks(limit = 6) {
  return prisma.book.findMany({
    where: { featured: true },
    orderBy: { rating: "desc" },
    take: limit,
  });
}

export async function getNewArrivals(limit = 10) {
  return prisma.book.findMany({
    where: { newArrival: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getStaffPicks(limit = 6) {
  return prisma.book.findMany({
    where: { staffPick: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getBooksByMood(mood: string, limit = 6) {
  return prisma.book.findMany({
    where: { mood },
    orderBy: { rating: "desc" },
    take: limit,
  });
}

export async function getMoodsWithBooks(limit = 6) {
  const grouped = await prisma.book.groupBy({
    by: ["mood"],
    where: { mood: { not: null } },
    _count: true,
  });
  const eligible = grouped.filter((g) => g._count >= 3 && g.mood).map((g) => g.mood as string);
  return eligible;
}

export async function getBookBySlug(slug: string) {
  return prisma.book.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getRelatedBooks(bookId: string, genre: string, limit = 4) {
  return prisma.book.findMany({
    where: { genre, id: { not: bookId } },
    orderBy: { rating: "desc" },
    take: limit,
  });
}

function buildOrderBy(sort?: SortOption): Prisma.BookOrderByWithRelationInput {
  switch (sort) {
    case "bestselling":
      return { ratingCount: "desc" };
    case "az":
      return { title: "asc" };
    case "za":
      return { title: "desc" };
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "rating":
      return { rating: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export async function getCatalog(filters: CatalogFilters) {
  const pageSize = 12;
  const page = Math.max(filters.page ?? 1, 1);

  const where: Prisma.BookWhereInput = {
    ...(filters.genre ? { genre: filters.genre } : {}),
    ...(filters.format ? { format: filters.format as Prisma.EnumFormatFilter["equals"] } : {}),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            ...(filters.minPrice ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}),
    ...(filters.minRating ? { rating: { gte: filters.minRating } } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" } },
            { author: { contains: filters.q, mode: "insensitive" } },
            { isbn: { contains: filters.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy: buildOrderBy(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.book.count({ where }),
  ]);

  return { books, total, page, pageSize, totalPages: Math.max(Math.ceil(total / pageSize), 1) };
}

export async function getGenreCounts() {
  const counts = await prisma.book.groupBy({ by: ["genre"], _count: true });
  return counts.reduce<Record<string, number>>((acc, c) => {
    acc[c.genre] = c._count;
    return acc;
  }, {});
}

export async function getPriceBounds() {
  const agg = await prisma.book.aggregate({ _min: { price: true }, _max: { price: true } });
  return { min: agg._min.price ?? 0, max: agg._max.price ?? 1000 };
}
