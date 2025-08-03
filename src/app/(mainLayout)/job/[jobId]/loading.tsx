import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingJobPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left side - job content skeleton */}
        <div className="space-y-8 col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-9 w-[300px] mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[120px]" />
              </div>
            </div>
          </div>

          {/* Job description skeleton */}
          <section className="space-y-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </section>

          {/* Benefits skeleton */}
          <section>
            <Skeleton className="h-6 w-[200px] mb-4" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 24 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-[140px] rounded-full" />
              ))}
            </div>
          </section>
        </div>

        {/* Right side - cards */}
        <div className="space-y-6">
          {/* Apply card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Skeleton className="h-6 w-[100px] mb-2" />
                <Skeleton className="h-8 w-[180px]" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>

          {/* About the role card */}
          <Card className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-[150px]" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Company card */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="rounded-full size-12" />
                <div>
                  <Skeleton className="h-5 w-[150px] mb-2" />
                  <Skeleton className="h-5 w-[200px]" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
