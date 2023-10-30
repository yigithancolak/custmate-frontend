'use client'

import { DashboardCard } from '@/components/DashboardCard/DashboardCard'
import {
  getFirstDayOfMonth,
  getFirstDayOfYear,
  getLastDayOfMonth,
  getLastDayOfYear
} from '@/lib/helpers/dateHelpers'
import { GET_DASHBOARD_DATA } from '@/lib/queries/dashboard'
import {
  DashboardDataResponse,
  DashboardDataVariables
} from '@/types/batchedTypes'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations('DashboardPage')

  const {
    data: dashboardData,
    loading: dashboardDataLoading,
    error: dashboardDataError
  } = useQuery<DashboardDataResponse, DashboardDataVariables>(
    GET_DASHBOARD_DATA,
    {
      variables: {
        activeFilter: { active: true },
        upcomingPaymentFilter: { upcomingPayment: true },
        latePaymentFilter: { latePayment: true },
        startDateOfMonth: getFirstDayOfMonth(),
        endDateOfMonth: getLastDayOfMonth(),
        startDateOfYear: getFirstDayOfYear(),
        endDateOfYear: getLastDayOfYear()
      }
    }
  )

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">{t('header')}</h3>
      <div className="flex w-10/12 md:w-8/12 flex-col gap-4 p-6">
        <DashboardCard
          type="customers"
          description={t('Cards.Customers.desc')}
          loading={dashboardDataLoading}
          path="/customers"
          contents={[
            {
              key: t('Cards.Customers.active'),
              value: String(dashboardData?.activeCustomers.totalCount)
            },
            {
              key: t('Cards.Customers.upcomingPayments'),
              value: String(dashboardData?.upcomingPayments.totalCount)
            },
            {
              key: t('Cards.Customers.latePayments'),
              value: String(dashboardData?.latePayments.totalCount)
            }
          ]}
        />

        <DashboardCard
          type="payments"
          description={t('Cards.Payments.desc')}
          contents={[
            {
              key: t('Cards.Payments.thisMonth'),
              value: String(dashboardData?.monthlyPayments.totalCount)
            },
            {
              key: t('Cards.Payments.thisYear'),
              value: String(dashboardData?.yearlyPayments.totalCount)
            }
          ]}
          path="/payments"
          loading={dashboardDataLoading}
        />

        <DashboardCard
          type="groups"
          description="Groups Info"
          contents={[
            {
              key: t('Cards.count'),
              value: String(dashboardData?.groups.totalCount)
            }
          ]}
          path="/groups"
          loading={dashboardDataLoading}
        />
      </div>
    </main>
  )
}
