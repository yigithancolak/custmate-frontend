'use client'

import { DashboardCard } from '@/components/DashboardCard/DashboardCard'
import { SEARCH_CUSTOMERS_QUERY } from '@/lib/queries/customer'
import { LIST_GROUPS_BY_ORGANIZATION } from '@/lib/queries/group'
import { LIST_PAYMENTS_FOR_MONTH } from '@/lib/queries/payment'
import {
  SearchCustomersResponse,
  SearchCustomersVariables
} from '@/types/customerTypes'
import { ListGroupsResponse, ListGroupsVariables } from '@/types/groupTypes'
import {
  ListPaymentsResponse,
  ListPaymentsVariables
} from '@/types/paymentTypes'
import { useQuery } from '@apollo/client'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations('DashboardPage')
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError
  } = useQuery<ListGroupsResponse, ListGroupsVariables>(
    LIST_GROUPS_BY_ORGANIZATION,
    {
      variables: {
        offset: 0,
        limit: 10
      }
    }
  )

  const {
    data: customersData,
    loading: customersLoading,
    error: customersError
  } = useQuery<SearchCustomersResponse, SearchCustomersVariables>(
    SEARCH_CUSTOMERS_QUERY,
    {
      variables: {
        filter: { active: true }
      }
    }
  )

  const {
    data: upcomingPaymentData,
    loading: upcomingPaymentLoading,
    error: upcomingPaymentError
  } = useQuery<SearchCustomersResponse, SearchCustomersVariables>(
    SEARCH_CUSTOMERS_QUERY,
    {
      variables: {
        filter: {
          upcomingPayment: true
        }
      }
    }
  )

  const {
    data: latePaymentData,
    loading: latePaymentLoading,
    error: latePaymentError
  } = useQuery<SearchCustomersResponse, SearchCustomersVariables>(
    SEARCH_CUSTOMERS_QUERY,
    {
      variables: {
        filter: {
          latePayment: true
        }
      }
    }
  )

  const {
    data: monthlyPaymentData,
    loading: monthlyPaymentLoading,
    error: monthlyPaymentError
  } = useQuery<ListPaymentsResponse, ListPaymentsVariables>(
    LIST_PAYMENTS_FOR_MONTH,
    {
      variables: {
        startDate: '2023-10-01',
        endDate: '2023-11-01'
      }
    }
  )

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">{t('header')}</h3>
      <div className="flex w-10/12 md:w-8/12 flex-col gap-4">
        <DashboardCard
          type="groups"
          description="Groups Info"
          contents={[
            {
              key: t('Cards.count'),
              value: String(groupsData?.listGroupsByOrganization.totalCount)
            }
          ]}
          path="/groups"
          loading={groupsLoading}
        />

        <DashboardCard
          type="customers"
          description="Customers Info"
          contents={[
            {
              key: t('Cards.Customers.active'),
              value: String(customersData?.searchCustomers.totalCount)
            },
            {
              key: t('Cards.Customers.upcomingPayments'),
              value: String(upcomingPaymentData?.searchCustomers.totalCount)
            },
            {
              key: t('Cards.Customers.latePayments'),
              value: String(latePaymentData?.searchCustomers.totalCount)
            }
          ]}
          path="/customers"
          loading={
            customersLoading || upcomingPaymentLoading || latePaymentLoading
          }
        />

        <DashboardCard
          type="payments"
          description={t('Cards.Payments.desc')}
          contents={[
            {
              key: t('Cards.Payments.thisMonth'),
              value: String(
                monthlyPaymentData?.listPaymentsByOrganization.totalCount
              )
            }
          ]}
          path="/payments"
          loading={monthlyPaymentLoading}
        />
      </div>
    </main>
  )
}
