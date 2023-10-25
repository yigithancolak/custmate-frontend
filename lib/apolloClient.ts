import {
  ApolloClient,
  InMemoryCache,
  ServerError,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { envVariables } from './envVariables'

export const createApolloClient = (accessToken: string, logout: () => void) => {
  const httpLink = createHttpLink({
    uri: `${envVariables.SERVER_URL}/query`,
    credentials: 'same-origin'
  })

  const authLink = setContext((_, { headers, skipAuth }) => {
    if (skipAuth) return { headers }
    return {
      headers: {
        ...headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    }
  })

  const errorLink = onError(({ networkError }) => {
    if (networkError && (networkError as ServerError).statusCode === 403) {
      logout()
    }
  })

  const link = authLink.concat(httpLink)

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(link)
  })
}
