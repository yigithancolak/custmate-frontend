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
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function InstructorsPage() {
  const router = useRouter()
  const t = useTranslations('InstructorsPage')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const { data, loading, error, refetch } = useQuery<
    ListInstructorsResponse,
    ListInstructorsVariables
  >(LIST_INSTRUCTORS_QUERY, {
    variables: {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize
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
          description: t('deleteMessage')
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
      header: t('ColumnHeaders.operations'),
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
      header: t('ColumnHeaders.name'),
      accessorKey: 'name'
    },
    {
      header: t('ColumnHeaders.groups'),
      accessorKey: 'groups',
      cell: (cell) => {
        const groupsOfInstructor = cell.getValue<GroupItem[]>()

        return (
          <div>
            {groupsOfInstructor.map((g) => (
              <p
                key={g.id}
                className="underline cursor-pointer"
                onClick={() => router.push(`/groups/${g.id}`)}
              >
                {g.name}
              </p>
            ))}
          </div>
        )
      }
    }
  ]

  if (error) return <p>Error: {error.message}</p>

  return (
    <PageLayout
      header={t('header')}
      columns={instructorColumns}
      data={data?.listInstructors.items || []}
      item="instructors"
      loading={loading}
      totalCount={data?.listInstructors.totalCount || 0}
      pagination={pagination}
      refetch={refetch}
      setPagination={setPagination}
    />
  )
}
