import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto shrink-0 sm:pt-1">
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <div className="order-2 sm:order-1 flex-1 space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mt-8">
        <Skeleton className="h-80 md:h-96 rounded-lg" />

        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </div>
  );
}
