'use client'
import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { DataTable } from '@/components/DataTable/DataTable'
import { DatePickerWithRange } from '@/components/DatePickerWithRange/DatePickerWithRange'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { toast } from '@/components/ui/use-toast'
import { adjustDateStringFormat, dateToString } from '@/lib/helpers/dateHelpers'
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
import { addMonths } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

export default function PaymentsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addMonths(new Date(), 1)
  })
  const t = useTranslations('PaymentsPage')
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
        startDate: dateToString(date?.from || new Date()),
        endDate: dateToString(date?.to || new Date())
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
          description: t('deleteMessage')
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
            title={t('DeleteModal.header')}
            description={t('DeleteModal.desc')}
            trigger={<Trash2 size={16} color="red" />}
            fn={() => handleDeletePayment(cell.getValue<string>())}
            loading={deletePaymentLoading}
          />
        </div>
      )
    },
    {
      header: t('ColumnHeaders.amount'),
      accessorKey: 'amount'
    },
    {
      header: t('ColumnHeaders.date'),
      accessorKey: 'date',
      cell: (cell) => {
        const date = cell.getValue<string>()
        return adjustDateStringFormat(date)
      }
    },
    {
      header: t('ColumnHeaders.paymentType'),
      accessorKey: 'paymentType'
    }
    // {
    //   accessorKey: 'customer',
    //   cell: (item) => item.cell.getValue<CustomerItem>().name || 0,
    //   header: 'Name of customer'
    // },
  ]

  if (error) return <p>Error: {error.message}</p>

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">{t('header')}</h3>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
          <CreateUpdateItemModal
            item="payments"
            refetch={refetchPayments}
            type="create"
          />
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
        <DataTable
          columns={paymentColumns}
          data={data?.listPaymentsByOrganization.items || []}
          loading={loading}
          totalCount={data?.listPaymentsByOrganization.totalCount || 0}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </main>
  )
}
