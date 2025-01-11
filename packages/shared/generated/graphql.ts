import type { DocumentNode } from "graphql/language/ast";
import type { GraphQLClient, RequestOptions } from "graphql-request";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Mutation = {
  __typename?: "Mutation";
  addToPlaylist: Scalars["Boolean"]["output"];
  updatePlaylist: Playlist;
  updatePlaylistSongRank: Scalars["Boolean"]["output"];
  updateUser: UpdateUserOutput;
};

export type MutationAddToPlaylistArgs = {
  playlistId: Scalars["ID"]["input"];
  songIds: InputMaybe<Array<Scalars["ID"]["input"]>>;
  songs: InputMaybe<Array<SongInput>>;
};

export type MutationUpdatePlaylistArgs = {
  name: Scalars["String"]["input"];
  playlistId: Scalars["ID"]["input"];
};

export type MutationUpdatePlaylistSongRankArgs = {
  playlistId: Scalars["ID"]["input"];
  rank: Scalars["String"]["input"];
  songId: Scalars["ID"]["input"];
};

export type MutationUpdateUserArgs = {
  user: UserInput;
};

export type Query = {
  __typename?: "Query";
  getVideoInfo: Array<SongVideo>;
  me: User;
  playlist: Playlist;
  similarArtists: Array<Artist>;
  topSongsByArtist: Array<Song>;
  userPlaylists: Array<Playlist>;
};

export type QueryGetVideoInfoArgs = {
  query: Scalars["String"]["input"];
};

export type QueryPlaylistArgs = {
  playlistId: Scalars["ID"]["input"];
};

export type QuerySimilarArtistsArgs = {
  artist: Scalars["String"]["input"];
  limit?: Scalars["Int"]["input"];
  onlyNames?: Scalars["Boolean"]["input"];
};

export type QueryTopSongsByArtistArgs = {
  artist: Scalars["String"]["input"];
  limit?: Scalars["Int"]["input"];
  page: InputMaybe<Scalars["Int"]["input"]>;
};

export type Account = {
  __typename?: "account";
  provider: Scalars["String"]["output"];
};

export type Artist = {
  __typename?: "artist";
  bannerImage: Maybe<Scalars["String"]["output"]>;
  biography: Maybe<Scalars["String"]["output"]>;
  disbanded: Maybe<Scalars["Boolean"]["output"]>;
  disbandedYear: Maybe<Scalars["String"]["output"]>;
  facebook: Maybe<Scalars["String"]["output"]>;
  formedYear: Maybe<Scalars["String"]["output"]>;
  genre: Maybe<Scalars["String"]["output"]>;
  image: Maybe<Scalars["String"]["output"]>;
  location: Maybe<Scalars["String"]["output"]>;
  logo: Maybe<Scalars["String"]["output"]>;
  memberQuantity: Maybe<Scalars["Float"]["output"]>;
  name: Scalars["String"]["output"];
  style: Maybe<Scalars["String"]["output"]>;
  twitter: Maybe<Scalars["String"]["output"]>;
  website: Maybe<Scalars["String"]["output"]>;
};

export type Playlist = {
  __typename?: "playlist";
  createdAt: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  songs: Maybe<Array<UserSong>>;
  type: Maybe<Scalars["Int"]["output"]>;
  user: Maybe<User>;
};

export type Song = {
  __typename?: "song";
  album: Maybe<Scalars["String"]["output"]>;
  artist: Scalars["String"]["output"];
  duration: Maybe<Scalars["String"]["output"]>;
  genre: Maybe<Scalars["String"]["output"]>;
  playcount: Maybe<Scalars["String"]["output"]>;
  playlistId: Maybe<Scalars["Int"]["output"]>;
  title: Scalars["String"]["output"];
  year: Maybe<Scalars["String"]["output"]>;
};

export type SongInput = {
  album: InputMaybe<Scalars["String"]["input"]>;
  artist: Scalars["String"]["input"];
  songUrl: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
};

export type SongVideo = {
  __typename?: "songVideo";
  artist: Scalars["String"]["output"];
  thumbnailUrl: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  videoId: Scalars["String"]["output"];
  videoUrl: Scalars["String"]["output"];
};

export type UpdateUserOutput = {
  __typename?: "updateUserOutput";
  email: Maybe<Scalars["String"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
};

export type User = {
  __typename?: "user";
  accounts: Array<Account>;
  createdAt: Scalars["String"]["output"];
  email: Maybe<Scalars["String"]["output"]>;
  hasPassword: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  name: Maybe<Scalars["String"]["output"]>;
  updatedAt: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
};

export type UserInput = {
  email: InputMaybe<Scalars["String"]["input"]>;
  name: InputMaybe<Scalars["String"]["input"]>;
  newPassword: InputMaybe<Scalars["String"]["input"]>;
  password: InputMaybe<Scalars["String"]["input"]>;
  username: Scalars["String"]["input"];
};

export type UserSong = {
  __typename?: "userSong";
  album: Maybe<Scalars["String"]["output"]>;
  artist: Scalars["String"]["output"];
  createdAt: Maybe<Scalars["String"]["output"]>;
  duration: Maybe<Scalars["String"]["output"]>;
  genre: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  playcount: Maybe<Scalars["String"]["output"]>;
  playlistId: Maybe<Scalars["Int"]["output"]>;
  rank: Maybe<Scalars["String"]["output"]>;
  songUrl: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  year: Maybe<Scalars["String"]["output"]>;
};

export type AddToPlaylistMutationMutationVariables = Exact<{
  playlistId: Scalars["ID"]["input"];
  songIds: InputMaybe<Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"]>;
  songs: InputMaybe<Array<SongInput> | SongInput>;
}>;

export type AddToPlaylistMutationMutation = {
  __typename?: "Mutation";
  addToPlaylist: boolean;
};

export type GetVideoInfoQueryQueryVariables = Exact<{
  query: Scalars["String"]["input"];
}>;

export type GetVideoInfoQueryQuery = {
  __typename?: "Query";
  getVideoInfo: Array<{
    __typename: "songVideo";
    artist: string;
    title: string;
    videoId: string;
    videoUrl: string;
    thumbnailUrl: string;
  }>;
};

export type MeQueryQueryVariables = Exact<{ [key: string]: never }>;

export type MeQueryQuery = {
  __typename?: "Query";
  me: {
    __typename: "user";
    id: string;
    name: string | null;
    email: string | null;
    username: string;
    createdAt: string;
    hasPassword: boolean;
    accounts: Array<{ __typename: "account"; provider: string }>;
  };
};

export type SimilarArtistsQueryQueryVariables = Exact<{
  artist: Scalars["String"]["input"];
  limit: InputMaybe<Scalars["Int"]["input"]>;
  onlyNames: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type SimilarArtistsQueryQuery = {
  __typename?: "Query";
  similarArtists: Array<{
    __typename: "artist";
    name: string;
    image: string | null;
    bannerImage: string | null;
  }>;
};

export type TopSongsByArtistQueryQueryVariables = Exact<{
  artist: Scalars["String"]["input"];
}>;

export type TopSongsByArtistQueryQuery = {
  __typename?: "Query";
  topSongsByArtist: Array<{
    __typename: "song";
    artist: string;
    title: string;
    playcount: string | null;
  }>;
};

export type UpdatePlaylistSongRankMutationMutationVariables = Exact<{
  playlistId: Scalars["ID"]["input"];
  songId: Scalars["ID"]["input"];
  rank: Scalars["String"]["input"];
}>;

export type UpdatePlaylistSongRankMutationMutation = {
  __typename?: "Mutation";
  updatePlaylistSongRank: boolean;
};

export type UpdatePlaylistMutationMutationVariables = Exact<{
  playlistId: Scalars["ID"]["input"];
  name: Scalars["String"]["input"];
}>;

export type UpdatePlaylistMutationMutation = {
  __typename?: "Mutation";
  updatePlaylist: { __typename?: "playlist"; id: string; name: string };
};

export type UpdateUserMutationMutationVariables = Exact<{
  user: UserInput;
}>;

export type UpdateUserMutationMutation = {
  __typename?: "Mutation";
  updateUser: {
    __typename: "updateUserOutput";
    name: string | null;
    username: string;
    email: string | null;
    updatedAt: string;
  };
};

export type PlaylistQueryQueryVariables = Exact<{
  playlistId: Scalars["ID"]["input"];
}>;

export type PlaylistQueryQuery = {
  __typename?: "Query";
  playlist: {
    __typename?: "playlist";
    id: string;
    name: string;
    type: number | null;
    songs: Array<{
      __typename?: "userSong";
      id: string;
      title: string;
      artist: string;
      songUrl: string | null;
      rank: string | null;
      createdAt: string | null;
    }> | null;
    user: { __typename?: "user"; id: string; name: string | null } | null;
  };
};

export type UserPlaylistsQueryQueryVariables = Exact<{ [key: string]: never }>;

export type UserPlaylistsQueryQuery = {
  __typename?: "Query";
  userPlaylists: Array<{
    __typename?: "playlist";
    id: string;
    name: string;
    createdAt: string | null;
  }>;
};

export const AddToPlaylistMutationDocument = gql`
  mutation addToPlaylistMutation(
    $playlistId: ID!
    $songIds: [ID!]
    $songs: [songInput!]
  ) {
    addToPlaylist(playlistId: $playlistId, songIds: $songIds, songs: $songs)
  }
`;
export const GetVideoInfoQueryDocument = gql`
  query getVideoInfoQuery($query: String!) {
    getVideoInfo(query: $query) {
      artist
      title
      videoId
      videoUrl
      thumbnailUrl
      __typename
    }
  }
`;
export const MeQueryDocument = gql`
  query meQuery {
    me {
      id
      name
      email
      username
      createdAt
      hasPassword
      accounts {
        provider
        __typename
      }
      __typename
    }
  }
`;
export const SimilarArtistsQueryDocument = gql`
  query similarArtistsQuery(
    $artist: String!
    $limit: Int
    $onlyNames: Boolean
  ) {
    similarArtists(artist: $artist, limit: $limit, onlyNames: $onlyNames) {
      name
      image
      bannerImage
      __typename
    }
  }
`;
export const TopSongsByArtistQueryDocument = gql`
  query topSongsByArtistQuery($artist: String!) {
    topSongsByArtist(artist: $artist) {
      artist
      title
      playcount
      __typename
    }
  }
`;
export const UpdatePlaylistSongRankMutationDocument = gql`
  mutation updatePlaylistSongRankMutation(
    $playlistId: ID!
    $songId: ID!
    $rank: String!
  ) {
    updatePlaylistSongRank(
      playlistId: $playlistId
      songId: $songId
      rank: $rank
    )
  }
`;
export const UpdatePlaylistMutationDocument = gql`
  mutation updatePlaylistMutation($playlistId: ID!, $name: String!) {
    updatePlaylist(name: $name, playlistId: $playlistId) {
      id
      name
    }
  }
`;
export const UpdateUserMutationDocument = gql`
  mutation updateUserMutation($user: userInput!) {
    updateUser(user: $user) {
      name
      username
      email
      updatedAt
      __typename
    }
  }
`;
export const PlaylistQueryDocument = gql`
  query playlistQuery($playlistId: ID!) {
    playlist(playlistId: $playlistId) {
      id
      name
      type
      songs {
        id
        title
        artist
        songUrl
        rank
        createdAt
      }
      user {
        id
        name
      }
    }
  }
`;
export const UserPlaylistsQueryDocument = gql`
  query userPlaylistsQuery {
    userPlaylists {
      id
      name
      createdAt
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    addToPlaylistMutation(
      variables: AddToPlaylistMutationMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AddToPlaylistMutationMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AddToPlaylistMutationMutation>(
            AddToPlaylistMutationDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "addToPlaylistMutation",
        "mutation",
        variables,
      );
    },
    getVideoInfoQuery(
      variables: GetVideoInfoQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<GetVideoInfoQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetVideoInfoQueryQuery>(
            GetVideoInfoQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "getVideoInfoQuery",
        "query",
        variables,
      );
    },
    meQuery(
      variables?: MeQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<MeQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<MeQueryQuery>(MeQueryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "meQuery",
        "query",
        variables,
      );
    },
    similarArtistsQuery(
      variables: SimilarArtistsQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<SimilarArtistsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SimilarArtistsQueryQuery>(
            SimilarArtistsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "similarArtistsQuery",
        "query",
        variables,
      );
    },
    topSongsByArtistQuery(
      variables: TopSongsByArtistQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<TopSongsByArtistQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TopSongsByArtistQueryQuery>(
            TopSongsByArtistQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "topSongsByArtistQuery",
        "query",
        variables,
      );
    },
    updatePlaylistSongRankMutation(
      variables: UpdatePlaylistSongRankMutationMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdatePlaylistSongRankMutationMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdatePlaylistSongRankMutationMutation>(
            UpdatePlaylistSongRankMutationDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "updatePlaylistSongRankMutation",
        "mutation",
        variables,
      );
    },
    updatePlaylistMutation(
      variables: UpdatePlaylistMutationMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdatePlaylistMutationMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdatePlaylistMutationMutation>(
            UpdatePlaylistMutationDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "updatePlaylistMutation",
        "mutation",
        variables,
      );
    },
    updateUserMutation(
      variables: UpdateUserMutationMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UpdateUserMutationMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UpdateUserMutationMutation>(
            UpdateUserMutationDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "updateUserMutation",
        "mutation",
        variables,
      );
    },
    playlistQuery(
      variables: PlaylistQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<PlaylistQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<PlaylistQueryQuery>(PlaylistQueryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "playlistQuery",
        "query",
        variables,
      );
    },
    userPlaylistsQuery(
      variables?: UserPlaylistsQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<UserPlaylistsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<UserPlaylistsQueryQuery>(
            UserPlaylistsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "userPlaylistsQuery",
        "query",
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
