'use client'

import { DataTable } from '@/components/DataTable/DataTable'
import { DatePickerWithRange } from '@/components/DatePickerWithRange/DatePickerWithRange'
import { Badge } from '@/components/ui/badge'
import { dateToString } from '@/lib/helpers/dateHelpers'
import { TotalEarning } from '@/lib/helpers/mathHelpers'
import { LIST_EARNINGS_BY_ORGANIZATION } from '@/lib/queries/earnings'
import {
  EarningItem,
  ListEarningsResponse,
  ListEarningsVariables
} from '@/types/earningTypes'
import { useQuery } from '@apollo/client'
import { ColumnDef, PaginationState } from '@tanstack/react-table'
import { addMonths } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

export default function EarningsPage() {
  const [totalEarning, setTotalEarning] = useState<TotalEarning>({
    TRY: 0,
    EUR: 0,
    USD: 0
  })
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addMonths(new Date(), 1)
  })

  const t = useTranslations('DashboardPage')

  const { data, loading, error } = useQuery<
    ListEarningsResponse,
    ListEarningsVariables
  >(LIST_EARNINGS_BY_ORGANIZATION, {
    variables: {
      startDate: dateToString(date?.from || new Date()),
      endDate: dateToString(date?.to || new Date()),
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize
    },
    skip: !date?.from || !date?.to,
    onCompleted(data) {
      setTotalEarning({
        TRY: data.listEarningsByOrganization.totalEarning.try,
        EUR: data.listEarningsByOrganization.totalEarning.eur,
        USD: data.listEarningsByOrganization.totalEarning.usd
      })
    }
  })

  const earningColumns: ColumnDef<EarningItem>[] = [
    {
      header: 'Group Name',
      accessorKey: 'group.name'
    },
    {
      header: 'TRY',
      accessorKey: 'try'
    },
    {
      header: 'USD',
      accessorKey: 'usd'
    },
    {
      header: 'EUR',
      accessorKey: 'eur'
    }
  ]

  if (error) {
    return <>error</>
  }

  return (
    <main className="flex flex-col items-center w-full h-full gap-2">
      <h3 className="text-2xl text-center py-6">Earnings</h3>

      <div className="flex w-10/12 md:w-10/12 flex-col gap-4">
        <div className="flex justify-between items-center gap-6 border-2 p-3 rounded-sm">
          <div className="flex flex-col gap-2">
            <span className="text-xs md:text-base">Pick the range</span>
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>

          <div className="flex flex-col md:flex-row  md:items-center gap-3 p-3 text-xs md:text-base whitespace-nowrap">
            <Badge>{totalEarning.TRY} &#8378;</Badge>
            <Badge>{totalEarning.USD} &#36;</Badge>
            <Badge>{totalEarning.EUR} &#8364;</Badge>
          </div>
        </div>

        <DataTable
          columns={earningColumns}
          data={data?.listEarningsByOrganization.items || []}
          loading={loading}
          pagination={pagination}
          setPagination={setPagination}
          totalCount={data?.listEarningsByOrganization.totalCount || 0}
        />
      </div>
    </main>
  )
}
