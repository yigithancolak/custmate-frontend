'use client'

import { CreateItemModal } from '@/components/CreateItemModal/CreateItemModal'
import { DataTable } from '@/components/DataTable/DataTable'
import { instructorColumns } from '@/components/DataTable/columns'
import { LIST_INSTRUCTORS_QUERY } from '@/lib/queries/instructor'
import {
  ListInstructorsResponse,
  ListInstructorsVariables
} from '@/types/instructorTypes'
import { useQuery } from '@apollo/client'

export default function InstructorsPage() {
  const { data, loading, error } = useQuery<
    ListInstructorsResponse,
    ListInstructorsVariables
  >(LIST_INSTRUCTORS_QUERY, {
    variables: {
      offset: 0,
      limit: 10
    }
  })

  if (error) return <p>Error: {error.message}</p>

  const instructors = data?.listInstructors || []

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Instructors Of Organization</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <CreateItemModal item="instructors" />
        <DataTable
          columns={instructorColumns}
          data={instructors}
          loading={loading}
        />
      </div>
    </main>
  )
}
