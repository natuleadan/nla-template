import { Skeleton } from "@/components/ui/skeleton";

export function CurrentTimeSkeleton() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border">
      <span className="inline-block size-2 rounded-full bg-muted-foreground/30 shrink-0" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
