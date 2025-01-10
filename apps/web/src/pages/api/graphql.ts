import 'reflect-metadata'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl'
import responseCachePlugin from '@apollo/server-plugin-response-cache'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { pick } from 'lodash'
import type { NextApiHandler } from 'next'
import { buildSchema } from 'type-graphql'

import { auth } from '@/auth'
import { ErrorInterceptor } from '@/server/middleware/error-interceptor'
import { UserResolver } from '@/server/schema/user/user-resolver'
import type { Context } from '@/types'
import { PlaylistResolver } from '@/server/schema/playlist/playlist-resolver'

const schema = await buildSchema({
  resolvers: [UserResolver, PlaylistResolver],
  globalMiddlewares: [ErrorInterceptor],
})

const server = new ApolloServer<Context>({
  schema,
  introspection: true,
  plugins: [
    ApolloServerPluginCacheControl({
      calculateHttpHeaders: 'if-cacheable',
      defaultMaxAge: 1,
    }),
    responseCachePlugin(),
  ],
  formatError: (error) => {
    return {
      ...pick(error, ['message', 'locations', 'path']),
    }
  },
})

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    const session = await auth(req, res)
    return { req, res, session }
  },
})

const graphql: NextApiHandler = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.NEXT_PUBLIC_SITE_URL || ''
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
  }

  try {
    return await handler(req, res)
  } catch (e) {
    res.status(500).send(`Error: ${e instanceof Error ? e.message : String(e)}`)
  }
}

export default graphql
