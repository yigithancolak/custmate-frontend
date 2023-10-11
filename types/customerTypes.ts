export type SearchCustomersResponse = {
  searchCustomers: {
    totalCount: number
    items: CustomerItem[]
  }
}

export type CustomerItem = {
  id: string
  name: string
  // Add other fields if needed
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
