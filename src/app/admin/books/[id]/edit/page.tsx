import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookForm } from "@/components/admin/book-form";

export const metadata = { title: "Edit book" };

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const book = await prisma.book.findUnique({ where: { id: params.id } });
  if (!book) notFound();

  return (
    <div>
      <p className="font-body text-sm text-ink-soft dark:text-paper-soft/60 mb-6">Editing “{book.title}”.</p>
      <BookForm
        bookId={book.id}
        book={{
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          genre: book.genre,
          price: book.price,
          coverUrl: book.coverUrl,
          synopsis: book.synopsis,
          authorBio: book.authorBio ?? undefined,
          rating: book.rating,
          ratingCount: book.ratingCount,
          stock: book.stock,
          format: book.format,
          year: book.year,
          featured: book.featured,
          staffPick: book.staffPick,
          staffNote: book.staffNote ?? undefined,
          newArrival: book.newArrival,
          mood: book.mood ?? undefined,
        }}
      />
    </div>
  );
}
