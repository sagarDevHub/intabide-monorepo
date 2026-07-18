import { Skeleton } from '@/components/ui/skeleton';

export function PlaygroundSkeleton() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Skeleton */}
      <div className="w-64 border-r p-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="pt-4 border-t">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full mt-2" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar Skeleton */}
        <div className="border-b p-2 flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>

        {/* Editor Skeleton */}
        <div className="flex-1 p-4">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Terminal Skeleton */}
        <div className="border-t h-32 p-2">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
