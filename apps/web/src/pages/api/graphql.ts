import 'reflect-metadata'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl'
import responseCachePlugin from '@apollo/server-plugin-response-cache'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { buildSchema } from 'type-graphql'
import { ErrorInterceptor } from '@/server/middleware/error-interceptor'
import { Context } from '@/types'
import { pick } from 'lodash'
import { auth } from '@/auth'
import { NextApiHandler, PageConfig } from 'next'
import { parseBody } from 'next/dist/server/api-utils/node/parse-body'
import { UserResolver } from '@/server/schema/user/user-resolver'

const schema = await buildSchema({
  resolvers: [UserResolver],
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

  const contentType = req.headers['content-type']

  if (contentType && contentType.indexOf('multipart/form-data') > -1) {
  } else {
    req.body = await parseBody(req, '10mb')
  }

  try {
    return await handler(req, res)
  } catch (e) {
    res.status(500).send(`Error: ${e instanceof Error ? e.message : String(e)}`)
  }
}

export default graphql
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

export const maxDuration = 40
