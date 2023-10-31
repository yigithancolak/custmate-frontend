'use client'
import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { DataTable2 } from '@/components/DataTable/DataTable2'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { useToast } from '@/components/ui/use-toast'
import { adjustDateStringFormat, formatTime } from '@/lib/helpers/dateHelpers'
import {
  DELETE_CUSTOMER_MUTATION,
  LIST_CUSTOMERS_BY_GROUP
} from '@/lib/queries/customer'
import { GET_GROUP_BY_ID } from '@/lib/queries/group'
import {
  CustomerItem,
  DeleteCustomerResponse,
  DeleteCustomerVariables,
  ListCustomersByGroupResponse,
  ListCustomersByGroupVariables
} from '@/types/customerTypes'
import { GetGroupResponse, GetGroupVariables } from '@/types/groupTypes'
import { useMutation, useQuery } from '@apollo/client'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Activity, Info, ShieldAlert, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { notFound, useParams } from 'next/navigation'
import { useState } from 'react'

export default function SingleGroupPage() {
  const { id } = useParams()
  const t = useTranslations('CustomersPage')
  const groupsT = useTranslations('GroupsPage')
  const daysT = useTranslations('Common.Days')

  const { toast } = useToast()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const {
    data: getGroupData,
    loading: getGroupLoading,
    error: getGroupError
  } = useQuery<GetGroupResponse, GetGroupVariables>(GET_GROUP_BY_ID, {
    variables: {
      id: id as string
    }
  })

  const {
    data,
    loading,
    error,
    refetch: refetchCustomers
  } = useQuery<ListCustomersByGroupResponse, ListCustomersByGroupVariables>(
    LIST_CUSTOMERS_BY_GROUP,
    {
      variables: {
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        groupId: id as string
      },
      skip: !!getGroupError
    }
  )

  const [deleteCustomer, { loading: deleteCustomerLoading }] = useMutation<
    DeleteCustomerResponse,
    DeleteCustomerVariables
  >(DELETE_CUSTOMER_MUTATION)

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer({
      variables: {
        id
      },
      onCompleted: () => {
        toast({
          description: t('deleteMessage')
        })
        refetchCustomers()
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          description: err.message
        })
      }
    })
  }

  const customerColumns: ColumnDef<CustomerItem>[] = [
    {
      header: t('ColumnHeaders.operations'),
      accessorKey: 'id',
      cell: (cell) => (
        <div className="flex flex-1 py-2">
          <CreateUpdateItemModal
            item="customers"
            refetch={refetchCustomers}
            type="update"
            itemId={cell.getValue<string>()}
          />
          <DialogBox
            title={t('DeleteModal.header')}
            description={t('DeleteModal.desc')}
            trigger={<Trash2 size={16} color="red" />}
            fn={() => handleDeleteCustomer(cell.getValue<string>())}
            loading={deleteCustomerLoading}
          />
        </div>
      )
    },
    {
      header: t('ColumnHeaders.name'),
      accessorKey: 'name'
    },
    {
      header: t('ColumnHeaders.lastPayment'),
      accessorKey: 'lastPayment',
      cell: (cell) => {
        const date = cell.getValue<string>()
        return adjustDateStringFormat(date)
      }
    },
    {
      header: t('ColumnHeaders.nextPayment'),
      accessorKey: 'nextPayment',
      cell: (cell) => {
        const date = cell.getValue<string>()
        return adjustDateStringFormat(date)
      }
    },
    {
      header: t('ColumnHeaders.phoneNumber'),
      accessorKey: 'phoneNumber'
    },
    {
      header: t('ColumnHeaders.activity'),
      accessorKey: 'active',
      cell: (cell) => {
        return cell.getValue<boolean>() ? (
          <Activity className="text-green-400" />
        ) : (
          <ShieldAlert className="text-yellow-300" />
        )
      }
    }
  ]

  if (getGroupError) {
    return notFound()
  }

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-3">
        {getGroupData?.getGroup.name}
      </h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <div className="flex gap-2 items-center justify-between">
          <CreateUpdateItemModal
            item="customers"
            refetch={refetchCustomers}
            type="create"
          />
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">
                <Info />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
              <div className="flex flex-col gap-2 items-start pt-2">
                <p>
                  <span className="font-semibold">
                    {groupsT('ColumnHeaders.name')}:
                  </span>{' '}
                  {getGroupData?.getGroup.name}
                </p>
                <p>
                  <span className="font-semibold">
                    {groupsT('ColumnHeaders.instructor')}:
                  </span>{' '}
                  {getGroupData?.getGroup.instructor.name}
                </p>
                <span className="font-semibold underline">
                  {groupsT('ColumnHeaders.times')}
                </span>
                <ul>
                  {getGroupData?.getGroup.times.map((time, i) => (
                    <li key={i}>
                      {daysT(time.day)} {formatTime(time.start_hour)} -
                      {formatTime(time.finish_hour)}
                    </li>
                  ))}
                </ul>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <DataTable2
          columns={customerColumns}
          data={data?.listCustomersByGroup || []}
          loading={loading}
        />
      </div>
    </main>
  )
}
