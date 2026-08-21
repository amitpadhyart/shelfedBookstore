import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <div className="container py-10 md:py-14">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-10 w-72 mb-10" />
      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <div className="hidden lg:block space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div>
          <Skeleton className="h-10 w-full mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[2/3] w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
