'use client'
import { CreateItemModal } from '@/components/CreateItemModal/CreateItemModal'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { toast } from '@/components/ui/use-toast'
import { PageLayout } from '@/layouts/PageLayout/PageLayout'
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
import { useState } from 'react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const {
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
          description: 'Customer successfully deleted'
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
      header: 'Operations',
      accessorKey: 'id',
      cell: (cell) => (
        <div className="flex flex-1 py-2">
          <CreateItemModal
            item="customers"
            refetch={refetchCustomers}
            type="update"
            itemId={cell.getValue<string>()}
          />
          <DialogBox
            title="Deleting Customer"
            description="Customer will be deleted it is permanent. Are you sure ?"
            trigger={<Trash2 size={16} color="red" />}
            fn={() => handleDeleteCustomer(cell.getValue<string>())}
            loading={deleteCustomerLoading}
          />
        </div>
      )
    },
    {
      header: 'Name of Customer',
      accessorKey: 'name'
    },
    {
      header: 'Last Payment',
      accessorKey: 'lastPayment',
      cell: (cell) => {
        const date = cell.getValue<string>()
        return date.split('T')[0]
      }
    },
    {
      header: 'Next Payment',
      accessorKey: 'nextPayment',
      cell: (cell) => {
        const date = cell.getValue<string>()
        return date.split('T')[0]
      }
    },
    {
      header: 'Phone Number',
      accessorKey: 'phoneNumber'
    },
    {
      header: 'Is Active',
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
