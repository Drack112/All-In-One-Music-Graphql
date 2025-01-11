import { QueryClient } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { getSdk } from 'music-shared'

import { getBaseURL } from './utils/get-base-url'

const gqlClient = new GraphQLClient(`${getBaseURL()}/api/graphql`)

export const {
  meQuery,
  updateUserMutation,
  userPlaylistsQuery,
  addToPlaylistMutation,
  getVideoInfoQuery,
  playlistQuery,
  updatePlaylistMutation,
  updatePlaylistSongRankMutation,
  topSongsByArtistQuery,
  similarArtistsQuery,
  searchArtistQuery,
  removeFromPlaylistMutation,
  importPlaylistMutation,
} = getSdk(gqlClient)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})
