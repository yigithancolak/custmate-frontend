'use client'

import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { toast } from '@/components/ui/use-toast'
import { PageLayout } from '@/layouts/PageLayout/PageLayout'
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
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<InstructorItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const { loading, error, refetch } = useQuery<
    ListInstructorsResponse,
    ListInstructorsVariables
  >(LIST_INSTRUCTORS_QUERY, {
    variables: {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize
    },
    onCompleted(data) {
      setInstructors(data.listInstructors.items)
      setTotalCount(data.listInstructors.totalCount)
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
          <CreateUpdateItemModal
            item="instructors"
            refetch={refetch}
            type="update"
            itemId={cell.getValue<string>()}
          />
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

  return (
    <PageLayout
      header="Instructors of Organization"
      columns={instructorColumns}
      data={instructors}
      item="instructors"
      loading={loading}
      totalCount={totalCount}
      pagination={pagination}
      refetch={refetch}
      setPagination={setPagination}
    />
  )
}
