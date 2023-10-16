import { GroupItem } from './groupTypes'

export type SearchCustomersResponse = {
  searchCustomers: {
    totalCount: number
    items: CustomerItem[]
  }
}

export type CustomerItem = {
  id: string
  name: string
  phoneNumber: string
  groups: GroupItem[]
  lastPayment: string
  nextPayment: string
  active: boolean
}

export type SearchCustomersVariables = {
  filter: SearchCustomerFilter
  offset?: number
  limit?: number
}

export type SearchCustomerFilter = {
  name?: string
  phoneNumber?: string
  active?: boolean
  latePayment?: boolean
  upcomingPayment?: boolean
}

export type DeleteCustomerResponse = {
  deleteCustomer: boolean
}

export type DeleteCustomerVariables = {
  id: string
}

export type CreateCustomerResponse = {
  createCustomer: CustomerItem
}

export type CreateCustomerInput = {
  name: string
  phoneNumber: string
  groups: string[]
  lastPayment: string // formatted as YYYY-MM-DD
  nextPayment: string // formatted as YYYY-MM-DD
}

export type ListCustomersByGroupResponse = {
  listCustomersByGroup: CustomerItem[]
}

export type ListCustomersByGroupVariables = {
  groupId: string
  offset?: number
  limit?: number
}
