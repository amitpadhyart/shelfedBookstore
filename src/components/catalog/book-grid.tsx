import { BookCard } from "@/components/book/book-card";
import type { Book } from "@prisma/client";

export function BookGrid({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl text-ink dark:text-paper-soft">No books on this shelf yet.</p>
        <p className="mt-2 font-body text-sm text-ink-soft dark:text-paper-soft/60">
          Try widening your filters, or clearing the search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10" role="list">
      {books.map((book) => (
        <div role="listitem" key={book.id}>
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
