import { BookCard } from "@/components/book/book-card";
import type { Book } from "@prisma/client";

export function RelatedBooks({ books }: { books: Book[] }) {
  if (books.length === 0) return null;
  return (
    <section className="mt-20" aria-labelledby="related-heading">
      <p className="section-label">You might also like</p>
      <h2 id="related-heading" className="font-display text-display-md mt-1 mb-8 text-ink dark:text-paper-soft">
        More from the shelf
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
