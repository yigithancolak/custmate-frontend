import { gql } from '@apollo/client'

export const GET_DASHBOARD_DATA = gql`
  query DashboardData(
    $activeFilter: SearchCustomerFilter!
    $upcomingPaymentFilter: SearchCustomerFilter!
    $latePaymentFilter: SearchCustomerFilter!
    $startDateOfMonth: String!
    $endDateOfMonth: String!
    $startDateOfYear: String!
    $endDateOfYear: String!
  ) {
    groups: listGroupsByOrganization {
      totalCount
    }

    instructors: listInstructors {
      totalCount
    }

    activeCustomers: searchCustomers(filter: $activeFilter) {
      totalCount
    }
    upcomingPayments: searchCustomers(filter: $upcomingPaymentFilter) {
      totalCount
    }
    latePayments: searchCustomers(filter: $latePaymentFilter) {
      totalCount
    }
    monthlyPayments: listPaymentsByOrganization(
      startDate: $startDateOfMonth
      endDate: $endDateOfMonth
    ) {
      totalCount
    }
    yearlyPayments: listPaymentsByOrganization(
      startDate: $startDateOfYear
      endDate: $endDateOfYear
    ) {
      totalCount
    }
  }
`
