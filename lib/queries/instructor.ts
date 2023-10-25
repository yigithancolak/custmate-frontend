import { gql } from '@apollo/client'

export const LIST_INSTRUCTORS_QUERY = gql`
  query ListInstructors($offset: Int, $limit: Int) {
    listInstructors(offset: $offset, limit: $limit) {
      items {
        id
        name
        groups {
          id
          name
        }
      }
      totalCount
    }
  }
`

export const GET_INSTRUCTOR_BY_ID = gql`
  query GetInstructorByID($id: ID!) {
    getInstructor(id: $id) {
      id
      name
      organizationId
      groups {
        id
        name
      }
    }
  }
`

export const CREATE_INSTRUCTOR_MUTATION = gql`
  mutation CreateInstructor($input: CreateInstructorInput!) {
    createInstructor(input: $input) {
      name
    }
  }
`

export const DELETE_INSTRUCTOR_MUTATION = gql`
  mutation DeleteInstructor($id: ID!) {
    deleteInstructor(id: $id)
  }
`

export const UPDATE_INSTRUCTOR_MUTATION = gql`
  mutation UpdateInstructor($id: ID!, $input: UpdateInstructorInput!) {
    updateInstructor(id: $id, input: $input)
  }
`
