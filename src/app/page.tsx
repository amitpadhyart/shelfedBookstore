import { Suspense } from "react";
import { Masthead, OpeningNote } from "@/components/home/masthead";
import { FrontTable } from "@/components/home/front-table";
import { NewArrivalsShelf } from "@/components/home/new-arrivals-shelf";
import { MoodSection } from "@/components/home/mood-section";
import { StaffTable } from "@/components/home/staff-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeaturedBooks, getNewArrivals, getStaffPicks, getBooksByMood, getMoodsWithBooks } from "@/lib/queries";
import { MOODS } from "@/types";

// Deliberately dynamic rather than `revalidate`-based ISR: this app is
// deployed to several targets (Vercel, Docker, Railway...) and a
// build-time-prerendered route would require the database to be reachable
// during `next build`, which isn't guaranteed on every target/ordering.
// Rendering per-request keeps `next build` independent of the database,
// and the Suspense boundaries below still stream each section in as it
// resolves, so it doesn't feel slower in practice.
export const dynamic = "force-dynamic";

async function FrontTableSection() {
  const books = await getFeaturedBooks(3);
  return <FrontTable books={books} />;
}

async function NewArrivalsSection() {
  const books = await getNewArrivals(10);
  return <NewArrivalsShelf books={books} />;
}

async function StaffTableSection() {
  const books = await getStaffPicks(6);
  return <StaffTable books={books} />;
}

async function MoodSections() {
  const availableMoodKeys = await getMoodsWithBooks();
  const orderedMoods = MOODS.filter((m) => availableMoodKeys.includes(m.key)).slice(0, 3);

  const sections = await Promise.all(
    orderedMoods.map(async (mood, i) => ({
      mood,
      books: await getBooksByMood(mood.key, 6),
      reverseAccent: i % 2 === 1,
    }))
  );

  return (
    <>
      {sections.map(({ mood, books, reverseAccent }) => (
        <MoodSection key={mood.key} label={mood.label} blurb={mood.blurb} books={books} reverseAccent={reverseAccent} />
      ))}
    </>
  );
}

function ShelfSkeleton() {
  return (
    <div className="container py-14">
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-8 w-56 mb-8" />
      <div className="flex gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] w-[150px] flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Masthead />
      <OpeningNote />
      <Suspense fallback={<ShelfSkeleton />}>
        <FrontTableSection />
      </Suspense>
      <Suspense fallback={<ShelfSkeleton />}>
        <NewArrivalsSection />
      </Suspense>
      <Suspense fallback={<ShelfSkeleton />}>
        <MoodSections />
      </Suspense>
      <Suspense fallback={<ShelfSkeleton />}>
        <StaffTableSection />
      </Suspense>
    </>
  );
}
