import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden gap-0 rounded-xl border bg-card text-card-foreground shadow-sm">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="px-4 pt-4 pb-2 space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="flex-1 px-4 pb-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </div>
      <div className="px-4 pb-4 pt-2 space-y-3">
        <div className="flex gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}
