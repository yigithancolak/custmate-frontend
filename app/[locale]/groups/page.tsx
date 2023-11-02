'use client'
import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { PageLayout } from '@/layouts/PageLayout/PageLayout'
import { formatTime } from '@/lib/helpers/dateHelpers'
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
import { Eye, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function GroupsPage() {
  const router = useRouter()
  const t = useTranslations('GroupsPage')
  const daysT = useTranslations('Common.Days')
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
      header: t('ColumnHeaders.operations'),
      accessorKey: 'id',
      cell: (cell) => (
        <div className="flex flex-1 py-2">
          <Button
            variant="outline"
            className="p-3 mr-2"
            onClick={() => {
              router.push(`/groups/${cell.getValue<string>()}`)
            }}
          >
            <Eye size={16} />
          </Button>

          <CreateUpdateItemModal
            item="groups"
            refetch={refetchGroups}
            type="update"
            itemId={cell.getValue<string>()}
          />

          <DialogBox
            title={t('DeleteModal.header')}
            description={t('DeleteModal.desc')}
            trigger={<Trash2 size={16} color="red" />}
            fn={() => handleDeleteGroup(cell.getValue<string>())}
            loading={deleteGroupLoading}
          />
        </div>
      )
    },
    {
      header: t('ColumnHeaders.name'),
      accessorKey: 'name'
    },
    {
      header: t('ColumnHeaders.instructor'),
      accessorKey: 'instructor.name'
    },
    {
      header: t('ColumnHeaders.times'),
      accessorKey: 'times',
      cell: (item) =>
        item.cell.getValue<TimeItem[]>().map((t, i) => (
          <p key={i}>
            {daysT(t.day)} {formatTime(t.start_hour)} -{' '}
            {formatTime(t.finish_hour)}
          </p>
        ))
    },
    {
      header: t('ColumnHeaders.customerCount'),
      accessorKey: 'customers',
      cell: (item) => item.cell.getValue<CustomerItem[]>()?.length || 0
    }
  ]

  if (error) return <p>Error: {error.message}</p>

  return (
    <PageLayout
      header={t('header')}
      columns={groupColumns}
      data={data?.listGroupsByOrganization.items || []}
      item="groups"
      loading={loading}
      totalCount={data?.listGroupsByOrganization.totalCount || 0}
      pagination={pagination}
      refetch={refetchGroups}
      setPagination={setPagination}
    />
  )
}
