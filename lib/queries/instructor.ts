import { gql } from '@apollo/client'

export const LIST_INSTRUCTORS_QUERY = gql`
  query ListInstructors($offset: Int = 0, $limit: Int = 10) {
    listInstructors(offset: $offset, limit: $limit) {
      id
      name
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
