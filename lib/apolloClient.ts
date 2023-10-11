import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { envVariables } from './envVariables'

const httpLink = createHttpLink({
  uri: `${envVariables.SERVER_URL}/query`
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

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
  })
})
