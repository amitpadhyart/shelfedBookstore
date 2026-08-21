"use client";

import { motion } from "framer-motion";
import { BookCard } from "@/components/book/book-card";
import type { Book } from "@prisma/client";

export function MoodSection({
  label,
  blurb,
  books,
  reverseAccent = false,
}: {
  label: string;
  blurb: string;
  books: Book[];
  reverseAccent?: boolean;
}) {
  if (books.length === 0) return null;

  return (
    <section className="py-14 md:py-20 border-t border-ink/15 dark:border-paper-soft/15" aria-labelledby={`mood-${label}`}>
      <div className="container">
        <div className="grid md:grid-cols-[minmax(0,280px)_1fr] gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="md:sticky md:top-24 md:self-start"
          >
            <p className={`section-label ${reverseAccent ? "text-wine dark:text-wine-light" : ""}`}>Mood shelf</p>
            <h2 id={`mood-${label}`} className="font-display text-display-md leading-[1.1] mt-2 text-ink dark:text-paper-soft text-balance">
              {label}
            </h2>
            <p className="mt-3 font-body text-ink-soft dark:text-paper-soft/70">{blurb}</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
