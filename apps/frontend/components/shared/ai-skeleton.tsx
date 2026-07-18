import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function AIPanelSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages Skeleton */}
        <div className="space-y-3">
          <div className="flex justify-start">
            <Skeleton className="h-12 w-3/4 rounded-lg" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-12 w-2/3 rounded-lg" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-16 w-3/4 rounded-lg" />
          </div>
        </div>

        {/* Input Skeleton */}
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
