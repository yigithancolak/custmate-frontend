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

export const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      id
      name
      instructor {
        id
        name
      }
      times {
        day
        start_hour
        finish_hour
      }
      customers {
        id
        name
      }
    }
  }
`
