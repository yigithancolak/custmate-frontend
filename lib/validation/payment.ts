import { Currency, PaymentType } from '@/types/paymentTypes'
import * as z from 'zod'

export const createPaymentSchema = z.object({
  amount: z.string(),
  date: z.date(),
  nextPaymentDate: z.date(),
  paymentType: z.nativeEnum(PaymentType),
  currency: z.nativeEnum(Currency),
  customerId: z.string().uuid(),
  groupId: z.string().uuid()
})

export const updatePaymentSchema = z.object({
  amount: z.string().optional(),
  date: z.date().optional(),
  paymentType: z.nativeEnum(PaymentType).optional(),
  currency: z.nativeEnum(Currency).optional()
})
