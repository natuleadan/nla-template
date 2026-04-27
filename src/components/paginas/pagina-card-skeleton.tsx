import { Skeleton } from "@/components/ui/skeleton";

export function PaginaCardSkeleton() {
  return (
    <div className="block p-4 rounded-lg border space-y-2">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}
