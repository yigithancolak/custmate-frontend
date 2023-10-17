import {
  ApolloClient,
  InMemoryCache,
  ServerError,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { envVariables } from './envVariables'

export const createApolloClient = (logout: () => void) => {
  const httpLink = createHttpLink({
    uri: `${envVariables.SERVER_URL}/query`,
    credentials: 'same-origin'
  })

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('accessToken')
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : ''
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
