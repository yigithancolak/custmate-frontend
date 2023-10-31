import { gql } from '@apollo/client'

export const SEARCH_CUSTOMERS_QUERY = gql`
  query SearchCustomers(
    $filter: SearchCustomerFilter!
    $offset: Int = 0
    $limit: Int = 10
  ) {
    searchCustomers(filter: $filter, offset: $offset, limit: $limit) {
      totalCount
      items {
        id
        name
        phoneNumber
        groups {
          id
          name
        }
        lastPayment
        nextPayment
        active
      }
    }
  }
`

export const LIST_CUSTOMERS_BY_GROUP = gql`
  query ListCustomersByGroup($groupId: ID!, $offset: Int, $limit: Int) {
    listCustomersByGroup(groupId: $groupId, offset: $offset, limit: $limit) {
      id
      name
      phoneNumber
      groups {
        id
        name
      }
      lastPayment
      nextPayment
      active
    }
  }
`

export const DELETE_CUSTOMER_MUTATION = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id)
  }
`

export const CREATE_CUSTOMER_MUTATION = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      name
      # groups
      # phoneNumber
      # lastPayment
      # nextPayment
    }
  }
`

export const UPDATE_CUSTOMER_MUTATION = gql`
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input)
  }
`

export const GET_CUSTOMER_BY_ID = gql`
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
      id
      name
      phoneNumber
      lastPayment
      nextPayment
      active
      groups {
        id
        name
      }
    }
  }
`
