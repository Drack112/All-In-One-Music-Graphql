import { QueryClient } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { getBaseURL } from './utils/get-base-url'
import { getSdk } from 'music-shared'

const gqlClient = new GraphQLClient(`${getBaseURL()}/api/graphql`)

export const { meQuery } = getSdk(gqlClient)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})
