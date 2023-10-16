'use client'
import { CreateItemModal } from '@/components/CreateItemModal/CreateItemModal'
import { DataTable } from '@/components/DataTable/DataTable'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
  DELETE_PAYMENT_MUTATION,
  LIST_PAYMENTS_BY_ORGANIZATION
} from '@/lib/queries/payment'
import {
  DeletePaymentResponse,
  DeletePaymentVariables,
  ListPaymentsResponse,
  ListPaymentsVariables,
  PaymentItem
} from '@/types/paymentTypes'
import { useMutation, useQuery } from '@apollo/client'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { PenSquare, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function PaymentsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const {
    data,
    loading,
    error,
    refetch: refetchPayments
  } = useQuery<ListPaymentsResponse, ListPaymentsVariables>(
    LIST_PAYMENTS_BY_ORGANIZATION,
    {
      variables: {
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        startDate: '2023-10-15',
        endDate: '2024-01-01'
      }
    }
  )

  const [deletePayment, { loading: deletePaymentLoading }] = useMutation<
    DeletePaymentResponse,
    DeletePaymentVariables
  >(DELETE_PAYMENT_MUTATION)

  const handleDeletePayment = (id: string) => {
    deletePayment({
      variables: {
        id
      },
      onCompleted: () => {
        toast({
          description: 'Payment successfully deleted'
        })
        refetchPayments()
      },
      onError: (err) => {
        toast({
          variant: 'destructive',
          description: err.message
        })
      }
    })
  }

  const paymentColumns: ColumnDef<PaymentItem>[] = [
    {
      header: 'Operations',
      accessorKey: 'id',
      cell: (cell) => (
        <div className="flex flex-1 py-2">
          <Button variant="outline" size="icon" className="mr-2">
            <PenSquare size={16} />
          </Button>
          <DialogBox
            title="Deleting payment"
            description="Payment will be deleted it is permanent. Are you sure ?"
            trigger={<Trash2 size={16} color="red" />}
            fn={() => handleDeletePayment(cell.getValue<string>())}
            loading={deletePaymentLoading}
          />
        </div>
      )
    },
    {
      accessorKey: 'amount',
      header: 'Amount'
    },
    {
      accessorKey: 'date',
      header: 'Date'
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment type'
    }
    // {
    //   accessorKey: 'customer',
    //   cell: (item) => item.cell.getValue<CustomerItem>().name || 0,
    //   header: 'Name of customer'
    // },
  ]

  if (error) return <p>Error: {error.message}</p>

  const payments = data?.listPaymentsByOrganization.items || []
  const pageCount =
    Math.ceil(
      (data?.listPaymentsByOrganization.totalCount as number) /
        pagination.pageSize
    ) || 0

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Payments Of Organization</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <CreateItemModal item="payments" refetch={refetchPayments} />
        <DataTable
          columns={paymentColumns}
          data={payments}
          loading={loading}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </main>
  )
}
