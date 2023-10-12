import { Skeleton } from '../ui/skeleton'

export function DashboardCardLoading() {
  return (
    <div className="flex flex-col gap-8 items-center p-6">
      <Skeleton className="w-1/3 h-[2vh] rounded-md " />
      <Skeleton className="w-1/4 h-[2vh] rounded-md " />
      <Skeleton className="w-3/4 h-[2vh] rounded-md " />
      <Skeleton className="w-1/4 h-[4vh] rounded-md " />
    </div>
  )
}
