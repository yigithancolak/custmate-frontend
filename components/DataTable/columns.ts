'use client'

import { CustomerItem } from '@/types/customerTypes'
import { GroupItem } from '@/types/groupTypes'
import { InstructorItem } from '@/types/instructorTypes'
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
    accessorKey: 'customers',
    cell: (item) => item.cell.getValue<CustomerItem[]>()?.length || 0,
    header: 'Number of Customers'
  }
]

export const instructorColumns: ColumnDef<InstructorItem>[] = [
  {
    accessorKey: 'id',
    header: 'Instructor ID'
  },
  {
    accessorKey: 'name',
    header: 'Instructor Name'
  },
  {
    accessorKey: 'groups',
    header: 'Number of Groups',
    cell: (item) => item.cell.getValue<GroupItem[]>()?.length || 0
  }
]
