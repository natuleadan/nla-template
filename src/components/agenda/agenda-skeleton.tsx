import { Skeleton } from "@/components/ui/skeleton";

export function AgendaSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-3 rounded-lg border min-w-[120px] flex-1"
        >
          <div className="text-center mb-2">
            <Skeleton className="h-3 w-10 mx-auto mb-1" />
            <Skeleton className="h-5 w-16 mx-auto" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-8 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
