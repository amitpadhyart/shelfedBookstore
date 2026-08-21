"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookCover } from "@/components/book/book-cover";
import { PriceTag } from "@/components/ui/badge";
import type { Book } from "@prisma/client";

const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-1"];

export function StaffTable({ books }: { books: Book[] }) {
  const picks = books.filter((b) => b.staffPick);
  if (picks.length === 0) return null;

  return (
    <section className="py-14 md:py-20 border-t border-ink/15 dark:border-paper-soft/15 bg-paper-warm/60 dark:bg-night-soft/40" aria-labelledby="staff-table-heading">
      <div className="container">
        <div className="mb-10 max-w-xl">
          <p className="section-label">The staff table</p>
          <h2 id="staff-table-heading" className="font-display text-display-md mt-2 text-ink dark:text-paper-soft">
            Index cards from under the shelf
          </h2>
          <p className="mt-3 font-body text-ink-soft dark:text-paper-soft/70">
            The books we keep pressing into customers&apos; hands, with the actual note that goes under the display copy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {picks.slice(0, 6).map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-4"
            >
              <Link href={`/books/${book.slug}`} className="w-24 flex-shrink-0">
                <BookCover
                  src={book.coverUrl}
                  title={book.title}
                  author={book.author}
                  className="aspect-[2/3] w-full"
                  sizes="96px"
                />
              </Link>

              <div className="flex-1 pt-1">
                <Link href={`/books/${book.slug}`}>
                  <h3 className="font-display text-base leading-snug text-ink hover:underline decoration-brass decoration-2 underline-offset-4 dark:text-paper-soft">
                    {book.title}
                  </h3>
                </Link>
                <p className="font-body text-xs text-ink-soft dark:text-paper-soft/60">{book.author}</p>
                <PriceTag amount={book.price} className="text-xs mt-1 inline-block" />

                {/* Index card — the signature element: a physical staff-pick note, translated */}
                {book.staffNote && (
                  <div
                    className={`relative mt-3 max-w-[220px] rounded-[2px] bg-paper-soft dark:bg-night-surface border border-ink/15 dark:border-paper-soft/15 shadow-pin px-3.5 py-3 ${rotations[i % rotations.length]}`}
                  >
                    {/* washi tape */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 w-10 bg-brass/40 dark:bg-brass/30 rotate-[-3deg]"
                    />
                    <p className="font-hand text-lg leading-snug text-ink dark:text-paper-soft">
                      &ldquo;{book.staffNote.replace(/\s—\s[A-Z]\.$/, "")}&rdquo;
                    </p>
                    <p className="mt-1 font-hand text-base text-ink-soft dark:text-paper-soft/60">
                      {book.staffNote.match(/—\s[A-Z]\.$/)?.[0] ?? ""}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
