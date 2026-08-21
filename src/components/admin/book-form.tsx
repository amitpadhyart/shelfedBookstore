"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema, type BookInput } from "@/lib/validations";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GENRES } from "@/types";

export function BookForm({
  book,
  bookId,
}: {
  book?: Partial<BookInput>;
  bookId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookInput>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      format: "PAPERBACK",
      rating: 0,
      ratingCount: 0,
      ...book,
    },
  });

  async function onSubmit(data: BookInput) {
    setError(null);
    const url = bookId ? `/api/admin/books/${bookId}` : "/api/admin/books";
    const method = bookId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Couldn't save that book.");
      return;
    }

    router.push("/admin/books");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} aria-invalid={!!errors.title} />
          {errors.title && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" {...register("author")} aria-invalid={!!errors.author} />
          {errors.author && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.author.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" {...register("isbn")} aria-invalid={!!errors.isbn} />
          {errors.isbn && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.isbn.message}</p>}
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Select id="genre" {...register("genre")}>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="format">Format</Label>
          <Select id="format" {...register("format")}>
            <option value="PAPERBACK">Paperback</option>
            <option value="HARDCOVER">Hardcover</option>
            <option value="EBOOK">Ebook</option>
          </Select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" type="number" {...register("price", { valueAsNumber: true })} aria-invalid={!!errors.price} />
          {errors.price && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} aria-invalid={!!errors.stock} />
          {errors.stock && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.stock.message}</p>}
        </div>
        <div>
          <Label htmlFor="year">Year published</Label>
          <Input id="year" type="number" {...register("year", { valueAsNumber: true })} aria-invalid={!!errors.year} />
          {errors.year && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.year.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="coverUrl">Cover image URL</Label>
        <Input id="coverUrl" placeholder="https://covers.openlibrary.org/b/isbn/…-L.jpg" {...register("coverUrl")} aria-invalid={!!errors.coverUrl} />
        {errors.coverUrl && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.coverUrl.message}</p>}
      </div>

      <div>
        <Label htmlFor="synopsis">Synopsis</Label>
        <Textarea id="synopsis" rows={4} {...register("synopsis")} aria-invalid={!!errors.synopsis} />
        {errors.synopsis && <p className="mt-1 text-xs text-wine dark:text-wine-light">{errors.synopsis.message}</p>}
      </div>

      <div>
        <Label htmlFor="authorBio">Author bio</Label>
        <Textarea id="authorBio" rows={2} {...register("authorBio")} />
      </div>

      <div>
        <Label htmlFor="staffNote">Staff note (shown as an index card on the homepage)</Label>
        <Input id="staffNote" placeholder={'"Read this in one sitting." — R.'} {...register("staffNote")} />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 font-body text-sm text-ink-soft dark:text-paper-soft/70">
          <input type="checkbox" {...register("featured")} className="h-4 w-4" /> Featured
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-ink-soft dark:text-paper-soft/70">
          <input type="checkbox" {...register("staffPick")} className="h-4 w-4" /> Staff pick
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-ink-soft dark:text-paper-soft/70">
          <input type="checkbox" {...register("newArrival")} className="h-4 w-4" /> New arrival
        </label>
      </div>

      <div>
        <Label htmlFor="mood">Mood tag (optional)</Label>
        <Select id="mood" {...register("mood")}>
          <option value="">None</option>
          <option value="slow-sunday">Slow Sunday</option>
          <option value="big-ideas">Big ideas</option>
          <option value="edge-of-seat">Edge of seat</option>
          <option value="heart-on-sleeve">Heart on sleeve</option>
          <option value="quiet-corner">Quiet corner</option>
          <option value="rainy-day">Rainy day</option>
        </Select>
      </div>

      {error && <p className="text-sm text-wine dark:text-wine-light">{error}</p>}

      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? "Saving…" : bookId ? "Save changes" : "Add book"}
      </Button>
    </form>
  );
}
