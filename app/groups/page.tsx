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
import { useMutation, useQuery } from '@apollo/client'
import { ColumnDef } from '@tanstack/react-table'
import { PenSquare, Trash2 } from 'lucide-react'

export default function GroupsPage() {
  const {
    data,
    loading,
    error,
    refetch: refetchGroups
  } = useQuery<ListGroupsResponse, ListGroupsVariables>(
    LIST_GROUPS_BY_ORGANIZATION,
    {
      variables: {
        offset: 0,
        limit: 10
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
      accessorKey: 'times.length',
      header: 'Number of Times'
    },
    {
      accessorKey: 'customers',
      cell: (item) => item.cell.getValue<CustomerItem[]>()?.length || 0,
      header: 'Number of Customers'
    }
  ]

  if (error) return <p>Error: {error.message}</p>

  const groups = data?.listGroupsByOrganization.items || []

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Groups Of Organization</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <CreateItemModal item="groups" refetch={refetchGroups} />
        <DataTable columns={groupColumns} data={groups} loading={loading} />
      </div>
    </main>
  )
}
