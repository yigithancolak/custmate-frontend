import { z } from 'zod'

export const envSchema = z.object({
  SERVER_URL: z.string()
})
