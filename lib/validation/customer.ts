import * as z from 'zod'

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number'),
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
