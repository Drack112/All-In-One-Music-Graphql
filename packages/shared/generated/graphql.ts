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
  updateUser: UpdateUserOutput;
};

export type MutationUpdateUserArgs = {
  user: UserInput;
};

export type Query = {
  __typename?: "Query";
  me: User;
  userPlaylists: Array<Playlist>;
};

export type Account = {
  __typename?: "account";
  provider: Scalars["String"]["output"];
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
