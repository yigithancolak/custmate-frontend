import { CustomerItem } from './customerTypes'

export type ListPaymentsResponse = {
  listPaymentsByOrganization: {
    totalCount: number
    items: PaymentItem[]
  }
}

export type ListPaymentsByCustomerResponse = {
  listPaymentsByCustomer: {
    totalCount: number
    items: PaymentItem[]
  }
}

export type PaymentItem = {
  id: string
  amount: number
  date: string
  customer: CustomerItem
  paymentType: PaymentType
  currency: Currency
}

export enum PaymentType {
  CREDIT_CARD = 'credit_card',
  CASH = 'cash'
}

export enum Currency {
  TRY = 'try',
  USD = 'usd',
  EUR = 'eur'
}

export type ListPaymentsVariables = {
  offset?: number
  limit?: number
  startDate: string
  endDate: string
}

export type ListPaymentsByCustomerVariables = ListPaymentsVariables & {
  customerId: string
}

export type GetPaymentResponse = {
  getPayment: PaymentItem
}

export type GetPaymentVariables = {
  id: string
}

export type DeletePaymentResponse = {
  deletePayment: boolean
}

export type DeletePaymentVariables = {
  id: string
}

export type CreatePaymentInput = {
  amount: number
  date: string
  nextPaymentDate: string
  paymentType: PaymentType
  currency: Currency
  customerId: string
  groupId: string
}

export type CreatePaymentResponse = {
  createPayment: PaymentItem
}

export type UpdatePaymentInput = {
  amount?: number
  date?: string
  paymentType?: PaymentType // Adjust as per the actual PaymentType enum values
  currency?: Currency // Adjust as per the actual Currency enum values
}

export type UpdatePaymentResponse = {
  updatePayment: string
}
