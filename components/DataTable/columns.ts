'use client'

import { GroupItem } from '@/types/groupTypes'
import { ColumnDef } from '@tanstack/react-table'

export const groupColumns: ColumnDef<GroupItem>[] = [
  {
    accessorKey: 'name',
    header: 'Group Name'
  },
  {
    accessorKey: 'instructor.name',
    header: 'Instructor'
  },
  {
    accessorKey: 'times.length',
    header: 'Number of Times'
  },
  {
    accessorKey: 'customers.length',
    header: 'Number of Customers'
  }
]
