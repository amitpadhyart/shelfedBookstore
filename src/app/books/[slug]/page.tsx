import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookCover } from "@/components/book/book-cover";
import { AddToCartPanel } from "@/components/book/add-to-cart-panel";
import { RatingStars } from "@/components/ui/rating-stars";
import { GenreTag, FormatTag, PriceTag } from "@/components/ui/badge";
import { ReviewList } from "@/components/book/review-list";
import { ReviewForm } from "@/components/book/review-form";
import { RelatedBooks } from "@/components/book/related-books";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookBySlug, getRelatedBooks } from "@/lib/queries";

interface BookPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const book = await getBookBySlug(params.slug);
  if (!book) return { title: "Book not found" };

  return {
    title: `${book.title} by ${book.author}`,
    description: book.synopsis.slice(0, 155),
    openGraph: {
      title: `${book.title} — Shelfed Bookstore`,
      description: book.synopsis.slice(0, 155),
      images: [{ url: book.coverUrl }],
      type: "book",
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.synopsis.slice(0, 155),
      images: [book.coverUrl],
    },
  };
}

async function RelatedBooksSection({ bookId, genre }: { bookId: string; genre: string }) {
  const related = await getRelatedBooks(bookId, genre);
  return <RelatedBooks books={related} />;
}

export default async function BookPage({ params }: BookPageProps) {
  const book = await getBookBySlug(params.slug);
  if (!book) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    isbn: book.isbn,
    image: book.coverUrl,
    aggregateRating: book.ratingCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: book.rating,
      reviewCount: book.ratingCount,
    } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: book.price,
      availability: book.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container py-10 md:py-14">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid md:grid-cols-[minmax(0,320px)_1fr] gap-10 md:gap-16">
        <div className="md:sticky md:top-24 md:self-start">
          <BookCover
            src={book.coverUrl}
            title={book.title}
            author={book.author}
            className="aspect-[2/3] w-full max-w-[320px] mx-auto md:mx-0"
            sizes="(max-width: 768px) 60vw, 320px"
            priority
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <GenreTag genre={book.genre} />
            <FormatTag format={book.format} />
          </div>

          <h1 className="font-display text-display-lg leading-[1.05] text-ink dark:text-paper-soft">{book.title}</h1>
          <p className="mt-2 font-display italic text-lg text-ink-soft dark:text-paper-soft/70">by {book.author}</p>

          <div className="mt-4 flex items-center gap-4">
            <RatingStars rating={book.rating} count={book.ratingCount} size="md" />
            <PriceTag amount={book.price} className="text-lg" />
          </div>

          <p className="mt-6 font-body text-base leading-relaxed text-ink-soft dark:text-paper-soft/80 max-w-prose">
            {book.synopsis}
          </p>

          <div className="mt-8 pt-8 rule">
            <AddToCartPanel book={book} />
          </div>

          <dl className="mt-8 pt-6 rule grid grid-cols-2 gap-4 font-mono text-xs">
            <div>
              <dt className="text-ink-faint dark:text-paper-soft/40 uppercase tracking-wide">ISBN</dt>
              <dd className="text-ink-soft dark:text-paper-soft/70 mt-0.5">{book.isbn}</dd>
            </div>
            <div>
              <dt className="text-ink-faint dark:text-paper-soft/40 uppercase tracking-wide">Published</dt>
              <dd className="text-ink-soft dark:text-paper-soft/70 mt-0.5">{book.year}</dd>
            </div>
          </dl>

          {book.authorBio && (
            <div className="mt-8 pt-8 rule">
              <p className="section-label mb-2">About the author</p>
              <p className="font-body text-sm leading-relaxed text-ink-soft dark:text-paper-soft/75 max-w-prose">
                {book.authorBio}
              </p>
            </div>
          )}

          <div className="mt-10 pt-8 rule">
            <p className="section-label mb-4">Reader reviews</p>
            <div className="mb-8">
              <ReviewForm bookId={book.id} />
            </div>
            <ReviewList reviews={book.reviews} />
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] w-full" />
            ))}
          </div>
        }
      >
        <RelatedBooksSection bookId={book.id} genre={book.genre} />
      </Suspense>
    </div>
  );
}
