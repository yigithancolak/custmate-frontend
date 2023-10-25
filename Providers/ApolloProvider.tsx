'use client'
import { createApolloClient } from '@/lib/apolloClient'
import { ApolloProvider } from '@apollo/client'
import { useAuth } from './AuthProvider'

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const { logout, accessToken } = useAuth()
  const client = createApolloClient(accessToken, logout)
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
