"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { CatalogToolbar } from "@/components/catalog/catalog-toolbar";

export function CatalogControls({
  total,
  priceBounds,
  genreCounts,
  children,
}: {
  total: number;
  priceBounds: { min: number; max: number };
  genreCounts: Record<string, number>;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-10">
      <FilterSidebar priceBounds={priceBounds} genreCounts={genreCounts} className="hidden lg:block" />

      <div>
        <CatalogToolbar total={total} onOpenMobileFilters={() => setDrawerOpen(true)} />
        <div className="mt-8">{children}</div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-paper dark:bg-night p-6 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="font-display text-xl text-ink dark:text-paper-soft">Filters</p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-ink/5 dark:hover:bg-paper-soft/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <FilterSidebar priceBounds={priceBounds} genreCounts={genreCounts} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
