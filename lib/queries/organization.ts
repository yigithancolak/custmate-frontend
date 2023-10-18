import { gql } from '@apollo/client'

export const GET_ORGANIZATION = gql`
  query GetOrganization {
    getOrganization {
      id
      name
      email
    }
  }
`
