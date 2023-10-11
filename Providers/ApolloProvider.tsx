'use client'

import { envVariables } from '@/lib/envVariables'
import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr'

function makeClient() {
  const isBrowser = typeof window !== 'undefined'
  const token = isBrowser ? localStorage.getItem('accessToken') : null

  const httpLink = new HttpLink({
    uri: `${envVariables.SERVER_URL}/query`,
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true
            }),
            httpLink
          ])
        : httpLink
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
