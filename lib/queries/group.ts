import { gql } from '@apollo/client'

export const LIST_GROUPS_DASHBOARD_QUERY = gql`
  query ListGroupsByOrganization($offset: Int = 0, $limit: Int = 10) {
    listGroupsByOrganization(offset: $offset, limit: $limit) {
      totalCount
      items {
        id
        name
        times {
          day
        }
        instructor {
          id
          name
        }
        customers {
          id
          name
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

export const DELETE_GROUP_MUTATION = gql`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`
