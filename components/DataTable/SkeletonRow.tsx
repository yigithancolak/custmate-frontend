'use client'

import { Skeleton } from '../ui/skeleton'
import { TableCell, TableRow } from '../ui/table'

export function SkeletonRow({ columnsCount }: { columnsCount: number }) {
  return (
    <TableRow>
      {Array.from({ length: columnsCount }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="w-full h-[2vh] rounded-md " />
        </TableCell>
      ))}
    </TableRow>
  )
}
