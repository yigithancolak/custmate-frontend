'use client'

import { CreateItemModal } from '@/components/CreateItemModal/CreateItemModal'
import { DataTable } from '@/components/DataTable/DataTable'
import { LIST_INSTRUCTORS_QUERY } from '@/lib/queries/instructor'
import { GroupItem } from '@/types/groupTypes'
import {
  InstructorItem,
  ListInstructorsResponse,
  ListInstructorsVariables
} from '@/types/instructorTypes'
import { useQuery } from '@apollo/client'
import { ColumnDef } from '@tanstack/react-table'

export default function InstructorsPage() {
  const { data, loading, error, refetch } = useQuery<
    ListInstructorsResponse,
    ListInstructorsVariables
  >(LIST_INSTRUCTORS_QUERY, {
    variables: {
      offset: 0,
      limit: 10
    }
  })

  const instructorColumns: ColumnDef<InstructorItem>[] = [
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

  if (error) return <p>Error: {error.message}</p>

  const instructors = data?.listInstructors || []

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Instructors Of Organization</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <CreateItemModal item="instructors" refetch={refetch} />
        <DataTable
          columns={instructorColumns}
          data={instructors}
          loading={loading}
        />
      </div>
    </main>
  )
}
