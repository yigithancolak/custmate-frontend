import { gql } from '@apollo/client'

export const LIST_PAYMENTS_FOR_MONTH = gql`
  query ListPaymentsByOrganization(
    $offset: Int = 0
    $limit: Int = 10
    $startDate: String!
    $endDate: String!
  ) {
    listPaymentsByOrganization(
      offset: $offset
      limit: $limit
      startDate: $startDate
      endDate: $endDate
    ) {
      totalCount
      items {
        date
        amount
        paymentType
      }
    }
  }
`
