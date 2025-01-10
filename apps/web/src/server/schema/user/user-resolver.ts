import { LibsqlError } from '@libsql/client'
import argon2 from 'argon2'
import { eq, getTableColumns } from 'drizzle-orm'
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'

import { dbErrorCodes } from '@/constants'
import { db } from '@/db/db'
import { Accounts, Users } from '@/db/schema'
import type { Context } from '@/types'

import { UpdateUserOutput, User, UserInput } from './user'

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  async me(@Ctx() ctx: Context): Promise<User> {
    const session = ctx.session

    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const userWithAccounts = await db
      .select()
      .from(Users)
      .leftJoin(Accounts, eq(Accounts.userId, Users.id))
      .where(eq(Users.id, session.user.id))

    const user = userWithAccounts[0]

    if (!user.users) {
      throw new Error('User not found')
    }

    const accounts = userWithAccounts
      .filter((userWithAccount) => !!userWithAccount.accounts)
      .map((userWithAccount) => userWithAccount.accounts)

    return {
      id: user.users.id,
      name: user.users.name,
      username: user.users.username,
      email: user.users.email ?? undefined,
      createdAt: user.users.createdAt,
      updatedAt: user.users.updatedAt,
      accounts: accounts.map((account) => ({
        provider: account!.provider,
      })),
    }
  }

  @FieldResolver(() => Boolean)
  async hasPassword(@Root() user: User): Promise<boolean> {
    const { password } = getTableColumns(Users)
    const [dbUser] = await db
      .select({ password })
      .from(Users)
      .where(eq(Users.id, user.id))

    return !!dbUser.password
  }
}
