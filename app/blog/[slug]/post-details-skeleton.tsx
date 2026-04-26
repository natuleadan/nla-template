import { Skeleton } from "@/components/ui/skeleton";

export function PostDetailsSkeleton() {
  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-4xl mx-auto w-full py-8 space-y-6">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="aspect-video rounded-lg" />
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    </div>
  );
}
