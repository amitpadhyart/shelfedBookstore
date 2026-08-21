import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Same reasoning as src/app/page.tsx — keep this off the build-time
// prerender path so `next build` never needs a reachable database.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await prisma.book.findMany({ select: { slug: true, updatedAt: true } });

  const bookEntries: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${siteUrl}/books/${book.slug}`,
    lastModified: book.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/catalog`, changeFrequency: "daily", priority: 0.9 },
    ...bookEntries,
  ];
}
