import { envSchema } from './validation/env'

export const envVariables = envSchema.parse({
  SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL
})
