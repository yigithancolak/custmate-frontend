import { gql } from '@apollo/client'

export const SEARCH_CUSTOMERS_QUERY = gql`
  query SearchCustomers(
    $filter: SearchCustomerFilter!
    $offset: Int = 0
    $limit: Int = 10
  ) {
    searchCustomers(filter: $filter, offset: $offset, limit: $limit) {
      totalCount
      items {
        id
        name
      }
    }
  }
`
