'use client'
import { CreateItemModal } from '@/components/CreateItemModal/CreateItemModal'
import { DataTable } from '@/components/DataTable/DataTable'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
  DELETE_GROUP_MUTATION,
  LIST_GROUPS_BY_ORGANIZATION
} from '@/lib/queries/group'
import { CustomerItem } from '@/types/customerTypes'
import {
  DeleteGroupResponse,
  DeleteGroupVariables,
  GroupItem,
  ListGroupsResponse,
  ListGroupsVariables
} from '@/types/groupTypes'
import { TimeItem } from '@/types/timeTypes'
import { useMutation, useQuery } from '@apollo/client'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { PenSquare, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function GroupsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const {
    data,
    loading,
    error,
    refetch: refetchGroups
  } = useQuery<ListGroupsResponse, ListGroupsVariables>(
    LIST_GROUPS_BY_ORGANIZATION,
    {
      variables: {
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize
      }
    }
  )

  const [deleteGroup, { loading: deleteGroupLoading }] = useMutation<
    DeleteGroupResponse,
    DeleteGroupVariables
  >(DELETE_GROUP_MUTATION)

  const handleDeleteGroup = (id: string) => {
    deleteGroup({
      variables: {
        id
      },
      onCompleted: () => {
        toast({
          description: 'Group successfully deleted'
        })
        refetchGroups()
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          description: err.message
        })
      }
    })
  }

  const groupColumns: ColumnDef<GroupItem>[] = [
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
            fn={() => handleDeleteGroup(cell.getValue<string>())}
            loading={deleteGroupLoading}
          />
        </div>
      )
    },
    {
      accessorKey: 'name',
      header: 'Group Name'
    },
    {
      accessorKey: 'instructor.name',
      header: 'Instructor'
    },
    {
      accessorKey: 'times',
      header: 'Days',
      cell: (item) =>
        item.cell.getValue<TimeItem[]>().map((t, i) => (
          <p key={i}>
            {t.day} {t.start_hour.slice(0, -3)} - {t.finish_hour.slice(0, -3)}
          </p>
        ))
    },
    {
      accessorKey: 'customers',
      cell: (item) => item.cell.getValue<CustomerItem[]>()?.length || 0,
      header: 'Number of Customers'
    }
  ]

  if (error) return <p>Error: {error.message}</p>

  const groups = data?.listGroupsByOrganization.items || []
  const pageCount =
    Math.ceil(
      (data?.listGroupsByOrganization.totalCount as number) /
        pagination.pageSize
    ) || 0

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Groups Of Organization</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <CreateItemModal item="groups" refetch={refetchGroups} />
        <DataTable
          columns={groupColumns}
          data={groups}
          loading={loading}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </main>
  )
}
