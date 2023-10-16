import { Currency, PaymentType } from '@/types/paymentTypes'
import * as z from 'zod'

export const createPaymentSchema = z.object({
  amount: z.number(),
  date: z.date(),
  nextPaymentDate: z.date(),
  paymentType: z.nativeEnum(PaymentType),
  currency: z.nativeEnum(Currency),
  customerId: z.string().uuid(),
  groupId: z.string().uuid()
})
