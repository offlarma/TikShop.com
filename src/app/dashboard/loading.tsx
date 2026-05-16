import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="space-y-4 rounded-xl border bg-card p-6 shadow">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-full" />
        <div className="grid gap-6 pt-2 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="min-h-[260px] w-full" />
        </div>
      </div>
    </div>
  );
}
