import { BookForm } from "@/components/admin/book-form";

export const metadata = { title: "Add a book" };

export default function NewBookPage() {
  return (
    <div>
      <p className="font-body text-sm text-ink-soft dark:text-paper-soft/60 mb-6">
        Add a new title to the catalog.
      </p>
      <BookForm />
    </div>
  );
}
