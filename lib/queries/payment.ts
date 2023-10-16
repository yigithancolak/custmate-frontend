import { gql } from '@apollo/client'

export const LIST_PAYMENTS_FOR_MONTH = gql`
  query ListPaymentsByOrganization(
    $offset: Int = 0
    $limit: Int = 10
    $startDate: String!
    $endDate: String!
  ) {
    listPaymentsByOrganization(
      offset: $offset
      limit: $limit
      startDate: $startDate
      endDate: $endDate
    ) {
      totalCount
      items {
        date
        amount
        paymentType
      }
    }
  }
`

export const LIST_PAYMENTS_BY_ORGANIZATION = gql`
  query ListPaymentsByOrganization(
    $offset: Int = 0
    $limit: Int = 10
    $startDate: String!
    $endDate: String!
  ) {
    listPaymentsByOrganization(
      offset: $offset
      limit: $limit
      startDate: $startDate
      endDate: $endDate
    ) {
      totalCount
      items {
        id
        amount
        date
        # customer {
        #   id
        #   name
        # }
        paymentType
        currency
      }
    }
  }
`

export const GET_PAYMENT_BY_ID = gql`
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
      id
      amount
      currency
      date
      paymentType
    }
  }
`

export const DELETE_PAYMENT_MUTATION = gql`
  mutation DeletePayment($id: ID!) {
    deletePayment(id: $id)
  }
`

export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
      amount
      date
      paymentType
      currency
    }
  }
`

export const UPDATE_PAYMENT_MUTATION = gql`
  mutation UpdatePayment($id: ID!, $input: UpdatePaymentInput!) {
    updatePayment(id: $id, input: $input)
  }
`
