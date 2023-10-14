'use client'
import { CreateItemModal } from '@/components/CreateItemModal/CreateItemModal'
import { DataTable } from '@/components/DataTable/DataTable'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
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
import { ColumnDef } from '@tanstack/react-table'
import { PenSquare, Trash2 } from 'lucide-react'

export default function CustomersPage() {
  const {
    data,
    loading,
    error,
    refetch: refetchCustomers
  } = useQuery<SearchCustomersResponse, SearchCustomersVariables>(
    SEARCH_CUSTOMERS_QUERY,
    {
      variables: {
        offset: 0,
        limit: 10,
        filter: {}
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
          <Button variant="outline" size="icon" className="mr-2">
            <PenSquare size={16} />
          </Button>
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

  const customers = data?.searchCustomers.items || []

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Customers Of Organization</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <CreateItemModal item="customers" refetch={refetchCustomers} />
        <DataTable
          columns={customerColumns}
          data={customers}
          loading={loading}
        />
      </div>
    </main>
  )
}
