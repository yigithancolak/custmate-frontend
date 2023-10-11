'use client'

import { DashboardCard } from '@/components/DashboardCard/DashboardCard'
import { SEARCH_CUSTOMERS_QUERY } from '@/lib/queries/customer'
import { LIST_GROUPS_DASHBOARD_QUERY } from '@/lib/queries/group'
import {
  SearchCustomersResponse,
  SearchCustomersVariables
} from '@/types/customerTypes'
import { ListGroupsResponse, ListGroupsVariables } from '@/types/groupTypes'
import { useQuery } from '@apollo/client'

export default function DashboardPage() {
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError
  } = useQuery<ListGroupsResponse, ListGroupsVariables>(
    LIST_GROUPS_DASHBOARD_QUERY,
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

  return (
    <main className="flex flex-col items-center w-full h-full">
      <h3 className="text-2xl text-center py-6">Dashboard</h3>
      <div className="flex w-10/12 md:w-8/12 border-2 flex-col">
        {!groupsLoading && (
          <DashboardCard
            title="Groups"
            description="Groups Info"
            contents={[
              {
                key: 'Count',
                value: String(groupsData?.listGroupsByOrganization.totalCount)
              }
            ]}
            path="/auth"
          />
        )}
        {!customersLoading &&
          !upcomingPaymentLoading &&
          !latePaymentLoading && (
            <DashboardCard
              title="Customers"
              description="Customers Info"
              contents={[
                {
                  key: 'Active',
                  value: String(customersData?.searchCustomers.totalCount)
                },
                {
                  key: 'Upcoming payments',
                  value: String(upcomingPaymentData?.searchCustomers.totalCount)
                },
                {
                  key: 'Late payments',
                  value: String(latePaymentData?.searchCustomers.totalCount)
                }
              ]}
              path="/auth"
            />
          )}
      </div>
    </main>
  )
}
