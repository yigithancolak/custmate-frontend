import * as z from 'zod'

export const createCustomerSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().min(10, {
    message: 'Phone number should be at least 10 characters.'
  }),
  groups: z.array(z.string().uuid('')),
  lastPayment: z.date({ required_error: 'Last payment date is required' }),
  nextPayment: z.date({ required_error: 'Next payment date is required' })
})

export const updateCustomerSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z
    .string()
    .min(10, {
      message: 'Phone number should be at least 10 characters.'
    })
    .optional(),
  groups: z.array(z.string().uuid('')).optional(),
  lastPayment: z
    .date({ required_error: 'Last payment date is required' })
    .optional(),
  nextPayment: z
    .date({ required_error: 'Next payment date is required' })
    .optional(),
  active: z.boolean().optional()
})
