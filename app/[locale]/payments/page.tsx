'use client'
import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { toast } from '@/components/ui/use-toast'
import { PageLayout } from '@/layouts/PageLayout/PageLayout'
import { adjustDateStringFormat } from '@/lib/helpers/dateHelpers'
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
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
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
      },
      onCompleted(data) {
        setPayments(data.listPaymentsByOrganization.items)
        setTotalCount(data.listPaymentsByOrganization.totalCount)
      }
    }
  )

  useEffect(() => {
    setPayments(data?.listPaymentsByOrganization.items || [])
    setTotalCount(data?.listPaymentsByOrganization.totalCount || 0)
  }, [data])

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
          <CreateUpdateItemModal
            item="payments"
            refetch={refetchPayments}
            type="update"
            itemId={cell.getValue<string>()}
          />
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
      header: 'Date',
      cell: (cell) => {
        const date = cell.getValue<string>()
        return adjustDateStringFormat(date)
      }
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

  return (
    <PageLayout
      header="Payments of Organization"
      columns={paymentColumns}
      data={payments}
      item="payments"
      loading={loading}
      pagination={pagination}
      refetch={refetchPayments}
      setPagination={setPagination}
      totalCount={totalCount}
    />
  )
}