'use client'
import { createApolloClient } from '@/lib/apolloClient'
import { ApolloProvider } from '@apollo/client'
import { useAuth } from './AuthProvider'

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const { logout } = useAuth()
  const client = createApolloClient(logout)
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
