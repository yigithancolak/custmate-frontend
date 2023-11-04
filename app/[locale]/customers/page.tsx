'use client'
import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { CustomerFilterPopover } from '@/components/CustomerFilterPopover/CustomerFilterPopover'
import { DataTable } from '@/components/DataTable/DataTable'
import { DateWarningToolTip } from '@/components/DateWarningToolTip/DateWarningToolTip'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { adjustDateStringFormat } from '@/lib/helpers/dateHelpers'
import {
  DELETE_CUSTOMER_MUTATION,
  SEARCH_CUSTOMERS_QUERY
} from '@/lib/queries/customer'
import { searchCustomerFilterSchema } from '@/lib/validation/customer'
import {
  CustomerItem,
  DeleteCustomerResponse,
  DeleteCustomerVariables,
  SearchCustomerFilter,
  SearchCustomersResponse,
  SearchCustomersVariables
} from '@/types/customerTypes'
import { GroupItem } from '@/types/groupTypes'
import { useMutation, useQuery } from '@apollo/client'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Activity, Eye, ShieldAlert, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'

export default function CustomersPage() {
  const router = useRouter()
  const t = useTranslations('CustomersPage')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [filters, setFilters] = useState<SearchCustomerFilter>({})

  const handleFilterChange = (
    values: z.infer<typeof searchCustomerFilterSchema>
  ) => {
    const choosenValues: z.infer<typeof searchCustomerFilterSchema> = {}

    if (values.name !== '') {
      choosenValues.name = values.name
    }

    if (values.phoneNumber !== '') {
      choosenValues.phoneNumber = values.phoneNumber
    }

    if (values.latePayment) {
      choosenValues.latePayment = true
    }

    if (values.upcomingPayment) {
      choosenValues.upcomingPayment = true
    }

    if (values.active) {
      choosenValues.active = values.active
    }

    console.log(choosenValues)

    setFilters(choosenValues)
  }

  const {
    data,
    loading,
    error,
    refetch: refetchCustomers
  } = useQuery<SearchCustomersResponse, SearchCustomersVariables>(
    SEARCH_CUSTOMERS_QUERY,
    {
      variables: {
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        filter: filters
      }
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
          <Button
            variant="outline"
            className="p-3 mr-2"
            onClick={() => {
              router.push(`/customers/${cell.getValue<string>()}`)
            }}
          >
            <Eye size={16} />
          </Button>
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
        return <DateWarningToolTip dateString={date} />
      }
    },
    {
      header: t('ColumnHeaders.phoneNumber'),
      accessorKey: 'phoneNumber'
    },
    {
      header: t('ColumnHeaders.groups'),
      accessorKey: 'groups',
      cell: (cell) => {
        const groupsOfCustomer = cell.getValue<GroupItem[]>()

        return (
          <div>
            {groupsOfCustomer.map((g) => (
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

  if (error) return <p>Error: {error.message}</p>

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">{t('header')}</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <div className="flex justify-between">
          <CreateUpdateItemModal
            item="customers"
            refetch={refetchCustomers}
            type="create"
          />
          <CustomerFilterPopover handleFilterChange={handleFilterChange} />
        </div>
        <DataTable
          columns={customerColumns}
          data={data?.searchCustomers.items || []}
          loading={loading}
          totalCount={data?.searchCustomers.totalCount || 0}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </main>
  )
}
