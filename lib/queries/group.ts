import { gql } from '@apollo/client'

export const LIST_GROUPS_DASHBOARD_QUERY = gql`
  query ListGroupsByOrganization($offset: Int = 0, $limit: Int = 10) {
    listGroupsByOrganization(offset: $offset, limit: $limit) {
      totalCount
      items {
        name
        times {
          day
        }
      }
    }
  }
`
