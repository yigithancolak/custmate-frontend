'use client'
import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { toast } from '@/components/ui/use-toast'
import { PageLayout } from '@/layouts/PageLayout/PageLayout'
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
import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function GroupsPage() {
  const t = useTranslations('GroupsPage')
  const [groups, setGroups] = useState<GroupItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const {
    loading,
    error,
    refetch: refetchGroups
  } = useQuery<ListGroupsResponse, ListGroupsVariables>(
    LIST_GROUPS_BY_ORGANIZATION,
    {
      variables: {
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize
      },
      onCompleted: (data) => {
        setGroups(data.listGroupsByOrganization.items)
        setTotalCount(data.listGroupsByOrganization.totalCount)
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
          <CreateUpdateItemModal
            item="groups"
            refetch={refetchGroups}
            type="update"
            itemId={cell.getValue<string>()}
          />
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

  return (
    <PageLayout
      header={t('header')}
      columns={groupColumns}
      data={groups}
      item="groups"
      loading={loading}
      totalCount={totalCount}
      pagination={pagination}
      refetch={refetchGroups}
      setPagination={setPagination}
    />
  )
}
