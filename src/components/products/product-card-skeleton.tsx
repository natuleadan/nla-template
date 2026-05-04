import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden gap-3 sm:gap-4 py-3 sm:py-4 rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10">
      <div className="px-3 sm:px-4 pb-2 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="relative aspect-[3/4] lg:aspect-square mx-3 sm:mx-4 rounded-lg overflow-hidden">
        <Skeleton className="absolute inset-0" />
        <div className="absolute top-2 left-2 z-10">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
      <div className="px-3 sm:px-4 py-2 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 flex-1 rounded-lg" />
      </div>
    </div>
  );
}
