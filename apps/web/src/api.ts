import { QueryClient } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { getBaseURL } from './utils/get-base-url'

const gqlClient = new GraphQLClient(`${getBaseURL()}/api/graphql`)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})
