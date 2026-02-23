import { Skeleton } from "@/components/ui/skeleton";

export default function StatCardSkeleton() {
  return (
    <div className="stat bg-base-300 rounded-xl shadow">
      <div className="stat-figure">
        <Skeleton className="size-6 rounded-md" />
      </div>
      <Skeleton className="h-4 w-24 mt-1" />
      <Skeleton className="h-8 w-16 mt-2" />
    </div>
  );
}
