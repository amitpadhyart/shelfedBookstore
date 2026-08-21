"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BookCover } from "@/components/book/book-cover";
import { PriceTag } from "@/components/ui/badge";
import type { Book } from "@prisma/client";

export function NewArrivalsShelf({ books }: { books: Book[] }) {
  if (books.length === 0) return null;

  return (
    <section className="py-14 md:py-20 border-t border-ink/15 dark:border-paper-soft/15" aria-labelledby="new-arrivals-heading">
      <div className="container">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="section-label">New on the shelf</p>
            <h2 id="new-arrivals-heading" className="font-display text-display-md mt-1 text-ink dark:text-paper-soft">
              Just unpacked
            </h2>
          </div>
          <Link
            href="/catalog?sort=newest"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-spine hover:gap-2.5 transition-all dark:text-brass-light"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="container">
        <div
          className="flex gap-5 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory -mx-1 px-1"
          role="list"
          aria-label="New arrival books, scrollable"
        >
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              role="listitem"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="w-[140px] sm:w-[160px] flex-shrink-0 snap-start"
            >
              <Link href={`/books/${book.slug}`} className="group block">
                <BookCover
                  src={book.coverUrl}
                  title={book.title}
                  author={book.author}
                  className="aspect-[2/3] w-full transition-transform duration-300 ease-book group-hover:-translate-y-1.5"
                  sizes="160px"
                />
                <h3 className="mt-2.5 font-display text-sm leading-snug text-ink line-clamp-2 dark:text-paper-soft">
                  {book.title}
                </h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-body text-xs text-ink-faint dark:text-paper-soft/50">{book.author}</span>
                  <PriceTag amount={book.price} className="text-xs" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <Link
          href="/catalog?sort=newest"
          className="sm:hidden mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-spine dark:text-brass-light"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
