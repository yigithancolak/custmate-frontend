'use client'
import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { toast } from '@/components/ui/use-toast'
import { PageLayout } from '@/layouts/PageLayout/PageLayout'
import { adjustDateStringFormat } from '@/lib/helpers/dateHelpers'
import {
  DELETE_CUSTOMER_MUTATION,
  SEARCH_CUSTOMERS_QUERY
} from '@/lib/queries/customer'
import {
  CustomerItem,
  DeleteCustomerResponse,
  DeleteCustomerVariables,
  SearchCustomersResponse,
  SearchCustomersVariables
} from '@/types/customerTypes'
import { useMutation, useQuery } from '@apollo/client'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function CustomersPage() {
  const t = useTranslations('CustomersPage')
  const [customers, setCustomers] = useState<CustomerItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

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
        filter: {}
      },
      onCompleted(data) {
        setCustomers(data.searchCustomers.items)
        setTotalCount(data.searchCustomers.totalCount)
      }
    }
  )

  useEffect(() => {
    setCustomers(data?.searchCustomers.items || [])
    setTotalCount(data?.searchCustomers.totalCount || 0)
  }, [data])

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
      accessorKey: 'active'
    }
    //TODO: ADD GROUPS TO SEARCH CUSTOMERS RESULT IN BACKEND
    // {
    //   header: 'Groups Count',
    //   accessorKey: 'groups',
    //   cell: (cell) => {
    //     const groupsOfCustomer = cell.getValue<GroupItem[]>()
    //     return groupsOfCustomer.length
    //   }
    // }
  ]

  if (error) return <p>Error: {error.message}</p>

  return (
    <PageLayout
      header={t('header')}
      columns={customerColumns}
      data={customers}
      item="customers"
      loading={loading}
      pagination={pagination}
      refetch={refetchCustomers}
      setPagination={setPagination}
      totalCount={totalCount}
    />
  )
}
