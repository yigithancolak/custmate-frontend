import { CustomerItem } from './customerTypes'

export type ListPaymentsResponse = {
  listPaymentsByOrganization: {
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
