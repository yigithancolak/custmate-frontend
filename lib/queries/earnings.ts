import { gql } from '@apollo/client'

export const LIST_EARNINGS_BY_ORGANIZATION = gql`
  query ListEarningsByOrganization(
    $offset: Int
    $limit: Int
    $startDate: String!
    $endDate: String!
  ) {
    listEarningsByOrganization(
      offset: $offset
      limit: $limit
      startDate: $startDate
      endDate: $endDate
    ) {
      totalCount
      items {
        group {
          id
          name
        }
        try
        usd
        eur
      }
      totalEarning {
        try
        eur
        usd
      }
    }
  }
`
