"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookCover } from "@/components/book/book-cover";
import { RatingStars } from "@/components/ui/rating-stars";
import { PriceTag } from "@/components/ui/badge";
import type { Book } from "@prisma/client";

/**
 * The "front table" — every good bookshop has one: the small handful of
 * books someone deliberately chose to put right where you'd see them first.
 */
export function FrontTable({ books }: { books: Book[] }) {
  if (books.length === 0) return null;

  return (
    <section className="py-14 md:py-20 border-t border-ink/15 dark:border-paper-soft/15" aria-labelledby="front-table-heading">
      <div className="container">
        <div className="mb-10 max-w-xl">
          <p className="section-label">The front table</p>
          <h2 id="front-table-heading" className="font-display text-display-md mt-2 text-ink dark:text-paper-soft">
            What we&apos;d put in your hands first
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-x-8 gap-y-12">
          {books.slice(0, 3).map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/books/${book.slug}`} className="group block">
                <BookCover
                  src={book.coverUrl}
                  title={book.title}
                  author={book.author}
                  className="aspect-[2/3] w-full transition-transform duration-300 ease-book group-hover:-translate-y-1.5"
                  sizes="(max-width: 640px) 80vw, 30vw"
                  priority={i === 0}
                />
                <h3 className="mt-4 font-display text-xl leading-snug text-ink group-hover:underline decoration-brass decoration-2 underline-offset-4 dark:text-paper-soft">
                  {book.title}
                </h3>
                <p className="mt-0.5 font-body text-sm text-ink-soft dark:text-paper-soft/60">{book.author}</p>
                <div className="mt-2 flex items-center justify-between">
                  <RatingStars rating={book.rating} count={book.ratingCount} />
                  <PriceTag amount={book.price} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
