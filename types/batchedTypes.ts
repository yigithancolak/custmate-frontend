import { SearchCustomerFilter } from './customerTypes'

export type DashboardDataVariables = {
  activeFilter: SearchCustomerFilter
  upcomingPaymentFilter: SearchCustomerFilter
  latePaymentFilter: SearchCustomerFilter
  startDateOfMonth: string
  endDateOfMonth: string
  startDateOfYear: string
  endDateOfYear: string
}

export type CountResponse = {
  totalCount: number
}

export type DashboardDataResponse = {
  activeCustomers: CountResponse
  upcomingPayments: CountResponse
  latePayments: CountResponse
  monthlyPayments: CountResponse
  yearlyPayments: CountResponse
  groups: CountResponse
}
