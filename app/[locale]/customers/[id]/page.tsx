'use client'
import { CreateUpdateItemModal } from '@/components/CreateUpdateItemModal/CreateUpdateItemModal'
import { DataTable2 } from '@/components/DataTable/DataTable2'
import { DatePickerWithRange } from '@/components/DatePickerWithRange/DatePickerWithRange'
import { DialogBox } from '@/components/DialogBox/DialogBox'
import { useToast } from '@/components/ui/use-toast'
import { adjustDateStringFormat, dateToString } from '@/lib/helpers/dateHelpers'
import { GET_CUSTOMER_BY_ID } from '@/lib/queries/customer'
import {
  DELETE_PAYMENT_MUTATION,
  LIST_PAYMENTS_BY_CUSTOMER
} from '@/lib/queries/payment'
import {
  GetCustomerResponse,
  GetCustomerVariables
} from '@/types/customerTypes'
import { GroupItem } from '@/types/groupTypes'
import {
  DeletePaymentResponse,
  DeletePaymentVariables,
  ListPaymentsByCustomerResponse,
  ListPaymentsByCustomerVariables,
  PaymentItem
} from '@/types/paymentTypes'
import { useMutation, useQuery } from '@apollo/client'
import { ColumnDef } from '@tanstack/react-table'
import { addMonths } from 'date-fns'
import { PersonStanding, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { notFound, useParams } from 'next/navigation'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

type CustomerInfo = {
  name: string
  phoneNumber: string
  lastPayment: string
  nextPayment: string
  groups: GroupItem[]
}

export default function SingleCustomerPage() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phoneNumber: '',
    lastPayment: '',
    nextPayment: '',
    groups: []
  })
  const { toast } = useToast()
  const t = useTranslations('PaymentsPage')
  const customersT = useTranslations('CustomersPage')
  const { id } = useParams()
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addMonths(new Date(), 1)
  })

  const {
    data: getCustomerData,
    loading: getCustomerLoading,
    error: getCustomerError
  } = useQuery<GetCustomerResponse, GetCustomerVariables>(GET_CUSTOMER_BY_ID, {
    variables: {
      id: id as string
    },
    onCompleted(data) {
      setCustomerInfo({
        name: data.getCustomer.name,
        phoneNumber: data.getCustomer.phoneNumber,
        lastPayment: adjustDateStringFormat(data.getCustomer.lastPayment),
        nextPayment: adjustDateStringFormat(data.getCustomer.nextPayment),
        groups: data.getCustomer.groups
      })
    }
  })

  const {
    data,
    loading,
    error,
    refetch: refetchPayments
  } = useQuery<ListPaymentsByCustomerResponse, ListPaymentsByCustomerVariables>(
    LIST_PAYMENTS_BY_CUSTOMER,
    {
      variables: {
        customerId: id as string,
        startDate: dateToString(date?.from || new Date()),
        endDate: dateToString(date?.to || new Date())
      },
      skip: !date?.from || !date?.to
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
  ]

  if (getCustomerError) return notFound()

  if (error) return <p>Error: {error.message}</p>

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h2 className="text-2xl text-center py-3">{customerInfo.name}</h2>
      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <div className="flex justify-center items-center gap-4 p-3 border-2">
          <PersonStanding size={100} />
          <div>
            <h4 className="text-base font-bold underline">
              {customersT('infoHeader')}
            </h4>
            {Object.keys(customerInfo).map((key) => {
              if (key === 'groups') return null

              const displayKey = key as keyof Omit<CustomerInfo, 'groups'>

              return (
                <div key={key} className="text-sm">
                  <span className="font-semibold">
                    {customersT(`ColumnHeaders.${key}`)}:{' '}
                  </span>
                  <span className="block break-words">
                    {customerInfo[displayKey]}
                  </span>
                </div>
              )
            })}
            <h4 className="text-base font-bold mt-2 underline">
              {customersT('ColumnHeaders.groups')}
            </h4>
            {customerInfo.groups.map((g) => (
              <p key={g.id}>{g.name}</p>
            ))}
          </div>
        </div>

        <h3 className="text-2xl text-center py-3">{t('header')}</h3>

        <div className="flex gap-2 items-center justify-between">
          <CreateUpdateItemModal
            item="payments"
            refetch={refetchPayments}
            type="create"
          />
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
        <DataTable2
          columns={paymentColumns}
          data={data?.listPaymentsByCustomer.items || []}
          loading={loading}
        />
      </div>
    </main>
  )
}
