import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Must be valid email'),
  password: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  })
})
