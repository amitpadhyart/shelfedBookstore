import type { Metadata } from "next";
import { CatalogControls } from "@/components/catalog/catalog-controls";
import { BookGrid } from "@/components/catalog/book-grid";
import { Pagination } from "@/components/catalog/pagination";
import { getCatalog, getGenreCounts, getPriceBounds } from "@/lib/queries";
import type { SortOption } from "@/types";

export const metadata: Metadata = {
  title: "Browse the catalog",
  description: "Filter by genre, format, price, and rating. Search titles, authors, and ISBNs.",
};

interface CatalogPageProps {
  searchParams: {
    q?: string;
    genre?: string;
    format?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    sort?: string;
    page?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters = {
    q: searchParams.q,
    genre: searchParams.genre,
    format: searchParams.format,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    minRating: searchParams.minRating ? Number(searchParams.minRating) : undefined,
    sort: searchParams.sort as SortOption | undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
  };

  const [{ books, total, page, totalPages }, genreCounts, priceBounds] = await Promise.all([
    getCatalog(filters),
    getGenreCounts(),
    getPriceBounds(),
  ]);

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    Object.entries({ ...searchParams, page: String(targetPage) }).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `/catalog?${params.toString()}`;
  }

  return (
    <div className="container py-10 md:py-14">
      <div className="mb-8">
        <p className="section-label">The catalog</p>
        <h1 className="font-display text-display-lg mt-2 text-ink dark:text-paper-soft">
          {filters.genre ? filters.genre : "Every book on the shelf"}
        </h1>
      </div>

      <CatalogControls total={total} priceBounds={priceBounds} genreCounts={genreCounts}>
        <BookGrid books={books} />
        <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
      </CatalogControls>
    </div>
  );
}
