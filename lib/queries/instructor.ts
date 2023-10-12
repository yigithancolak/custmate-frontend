import { gql } from '@apollo/client'

export const LIST_INSTRUCTORS_QUERY = gql`
  query ListInstructors($offset: Int = 0, $limit: Int = 10) {
    listInstructors(offset: $offset, limit: $limit) {
      id
      name
    }
  }
`
