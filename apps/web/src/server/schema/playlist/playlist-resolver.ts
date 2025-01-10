import { playlistType } from '@/constants'
import { Context } from '@/types'
import { map } from 'lodash'
import { Ctx, Query, Resolver } from 'type-graphql'

import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/db/db'
import { Playlist } from './playlist'
import { Playlists } from '@/db/schema'

@Resolver()
export class PlaylistResolver {
  @Query(() => [Playlist])
  async userPlaylists(@Ctx() ctx: Context): Promise<Playlist[]> {
    const session = ctx.session

    if (!session?.user) {
      throw Error('Unauthorized')
    }

    const playlists = await db
      .select()
      .from(Playlists)
      .where(
        and(
          eq(Playlists.userId, session.user.id),
          eq(Playlists.type, playlistType.PLAYLIST)
        )
      )
      .orderBy(desc(Playlists.createdAt))

    return map(playlists, (playlist) => ({
      id: playlist.id,
      name: playlist.name,
      userId: playlist.userId,
      createdAt: playlist.createdAt,
    }))
  }
}
