import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-full" />
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