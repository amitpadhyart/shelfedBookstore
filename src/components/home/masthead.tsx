"use client";

import { motion } from "framer-motion";

const today = new Date();
const issueLabel = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(today);

export function Masthead() {
  return (
    <header className="border-b border-ink/15 dark:border-paper-soft/15">
      <div className="container pt-10 pb-8 md:pt-14 md:pb-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft dark:text-paper-soft/60"
        >
          <span>No. 04 &middot; {issueLabel}</span>
          <span className="hidden sm:inline">Est. Somewhere with good light</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-display-xl tracking-tight text-ink dark:text-paper-soft"
        >
          Shelfed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 max-w-md font-display italic text-lg text-ink-soft dark:text-paper-soft/70"
        >
          a bookstore, mostly — and a few opinions about what you should read next.
        </motion.p>
      </div>
    </header>
  );
}

export function OpeningNote() {
  return (
    <section className="container py-14 md:py-20" aria-label="A note from the booksellers">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl"
      >
        <p className="font-display text-display-md leading-[1.15] text-balance text-ink dark:text-paper-soft">
          Some shops sell books. We keep a shelf open for whoever wanders in on a slow afternoon —
          <span className="text-spine dark:text-brass-light"> and we&apos;ve left a note under the ones we couldn&apos;t stop talking about.</span>
        </p>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint dark:text-paper-soft/50">
          — the booksellers
        </p>
      </motion.div>
    </section>
  );
}
