import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 space-y-3">
      <Skeleton className="h-9 w-72 sm:h-10" />
      <Skeleton className="h-5 w-96 max-w-full" />
    </div>
  );
}
