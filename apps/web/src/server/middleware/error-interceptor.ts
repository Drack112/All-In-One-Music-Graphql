import type { MiddlewareFn } from 'type-graphql'

import type { Context } from '@/types'

import { logger } from '../logger'

export const ErrorInterceptor: MiddlewareFn<Context> = async (_, next) => {
  try {
    return await next()
  } catch (error) {
    logger.error({ error })
    throw error
  }
}
