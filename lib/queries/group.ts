import { gql } from '@apollo/client'

export const LIST_GROUPS_BY_ORGANIZATION = gql`
  query ListGroupsByOrganization($offset: Int = 0, $limit: Int = 10) {
    listGroupsByOrganization(offset: $offset, limit: $limit) {
      totalCount
      items {
        id
        name
        times {
          day
          start_hour
          finish_hour
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

export const LIST_GROUPS_BY_ORGANIZATION_NO_SUB_ELEMENTS = gql`
  query ListGroupsByOrganization($offset: Int = 0, $limit: Int = 10) {
    listGroupsByOrganization(offset: $offset, limit: $limit) {
      totalCount
      items {
        id
        name
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

export const UPDATE_GROUP_MUTATION = gql`
  mutation UpdateGroup($id: ID!, $input: UpdateGroupInput!) {
    updateGroup(id: $id, input: $input)
  }
`

export const GET_GROUP_BY_ID = gql`
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
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
      # customers {

      # }
    }
  }
`
