'use client'

import { CreateItemModal } from '@/components/CreateItemModal/CreateItemModal'
import { DataTable } from '@/components/DataTable/DataTable'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
  DELETE_INSTRUCTOR_MUTATION,
  LIST_INSTRUCTORS_QUERY
} from '@/lib/queries/instructor'
import { GroupItem } from '@/types/groupTypes'
import {
  DeleteInstructorResponse,
  DeleteInstructorVariables,
  InstructorItem,
  ListInstructorsResponse,
  ListInstructorsVariables
} from '@/types/instructorTypes'
import { useMutation, useQuery } from '@apollo/client'
import { ColumnDef } from '@tanstack/react-table'
import { PenSquare, Trash2 } from 'lucide-react'

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

  const [deleteInstructor, { loading: deleteInstructorLoading }] = useMutation<
    DeleteInstructorResponse,
    DeleteInstructorVariables
  >(DELETE_INSTRUCTOR_MUTATION)

  const handleDeleteInstructor = (id: string) => {
    deleteInstructor({
      variables: {
        id
      },
      onCompleted: () => {
        toast({
          description: "Instructor and instructor's groups successfully deleted"
        })
        refetch()
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          description: err.message
        })
      }
    })
  }

  const instructorColumns: ColumnDef<InstructorItem>[] = [
    {
      header: 'Operations',
      accessorKey: 'id',
      cell: (cell) => (
        <div className="flex flex-1 py-2">
          <Button variant="outline" size="icon" className="mr-2">
            <PenSquare size={16} />
          </Button>
          <DialogBox
            title="Deleting group"
            description="Group will be deleted it is permanent. Are you sure ?"
            trigger={<Trash2 size={16} color="red" />}
            fn={() => handleDeleteInstructor(cell.getValue<string>())}
            loading={deleteInstructorLoading}
          />
        </div>
      )
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
