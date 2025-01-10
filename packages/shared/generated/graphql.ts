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

export type Query = {
  __typename?: "Query";
  me: User;
};

export type Account = {
  __typename?: "account";
  provider: Scalars["String"]["output"];
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
  };
}
export type Sdk = ReturnType<typeof getSdk>;
