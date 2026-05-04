import { Skeleton } from "@/components/ui/skeleton";

export function PostDetailsSkeleton() {
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
      <div className="md:flex md:gap-8 lg:gap-12 md:items-start">
        <div className="md:w-80 lg:w-96 shrink-0 mb-6 md:mb-0">
          <Skeleton className="aspect-video md:aspect-[3/4] rounded-lg" />
        </div>
        <div className="md:flex-1 min-w-0 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
