'use client'

import { Skeleton } from '../ui/skeleton'

interface FormModalLoadingProps {
  fieldCount: number
}

export function FormModalLoading(props: FormModalLoadingProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {Array.from({ length: props.fieldCount }).map((_, idx) => {
        return (
          <div key={idx} className="flex flex-col w-full gap-3">
            <Skeleton className="w-[100px] h-[16px] rounded" />
            <Skeleton className="h-[30px] rounded" />
          </div>
        )
      })}
    </div>
  )
}
