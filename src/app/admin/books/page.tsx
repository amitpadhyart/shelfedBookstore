import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { DeleteBookButton } from "@/components/admin/delete-book-button";
import { LinkButton } from "@/components/ui/link-button";

export const metadata = { title: "Manage books" };

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="font-body text-sm text-ink-soft dark:text-paper-soft/60">{books.length} books in the catalog</p>
        <LinkButton href="/admin/books/new" size="sm">
          <Plus className="h-4 w-4" /> Add a book
        </LinkButton>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left rule">
              <th className="pb-3 font-mono text-xs uppercase tracking-wide text-ink-faint dark:text-paper-soft/40">Title</th>
              <th className="pb-3 font-mono text-xs uppercase tracking-wide text-ink-faint dark:text-paper-soft/40">Genre</th>
              <th className="pb-3 font-mono text-xs uppercase tracking-wide text-ink-faint dark:text-paper-soft/40">Price</th>
              <th className="pb-3 font-mono text-xs uppercase tracking-wide text-ink-faint dark:text-paper-soft/40">Stock</th>
              <th className="pb-3 font-mono text-xs uppercase tracking-wide text-ink-faint dark:text-paper-soft/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="rule">
                <td className="py-3 pr-4">
                  <p className="font-display text-ink dark:text-paper-soft">{book.title}</p>
                  <p className="font-body text-xs text-ink-faint dark:text-paper-soft/40">{book.author}</p>
                </td>
                <td className="py-3 pr-4 font-body text-ink-soft dark:text-paper-soft/70">{book.genre}</td>
                <td className="py-3 pr-4 font-mono text-ink-soft dark:text-paper-soft/70">{formatINR(book.price)}</td>
                <td className="py-3 pr-4 font-mono">
                  <span className={book.stock === 0 ? "text-wine dark:text-wine-light" : "text-ink-soft dark:text-paper-soft/70"}>
                    {book.stock}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/books/${book.id}/edit`} aria-label={`Edit ${book.title}`} className="text-ink-faint hover:text-spine dark:hover:text-brass-light">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteBookButton id={book.id} title={book.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
