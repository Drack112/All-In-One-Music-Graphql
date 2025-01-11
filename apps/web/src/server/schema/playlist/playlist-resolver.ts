import { playlistType } from '@/constants'
import type { Context } from '@/types'
import { chunk, isEmpty, keyBy, map } from 'lodash'
import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'
import { LexoRank } from 'lexorank'

import { and, desc, eq, getTableColumns, inArray } from 'drizzle-orm'
import { db } from '@/db/db'
import { getLastRankInPlaylist, Playlist } from './playlist'
import { Playlists, PlaylistsToSongs, Songs, Users } from '@/db/schema'
import { SongInput } from '../song/song'
import { logger } from '@/server/logger'

@Resolver(Playlist)
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

  @Mutation(() => Boolean)
  async addToPlaylist(
    @Ctx() ctx: Context,
    @Arg('playlistId', () => ID) playlistId: string,
    @Arg('songIds', () => [ID], { nullable: true }) songIds?: string[],
    @Arg('songs', () => [SongInput], { nullable: true })
    songs?: SongInput[]
  ): Promise<boolean> {
    const session = ctx.session

    const { userId } = getTableColumns(Playlists)

    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    if (!songIds && !songs) {
      throw new Error('No songs provided')
    }

    const [playlist] = await db
      .select({
        userId,
      })
      .from(Playlists)
      .where(eq(Playlists.id, playlistId))

    if (playlist.userId !== session.user.id) {
      throw new Error('Unauthorized')
    }

    const hasExistingSongs = !isEmpty(songIds)

    const itemsCount = hasExistingSongs ? songIds!.length : songs?.length

    try {
      await db.transaction(async (tx) => {
        if (hasExistingSongs && !!songIds) {
          const songUrls = await tx
            .select({
              songUrl: PlaylistsToSongs.songUrl,
              songId: PlaylistsToSongs.songId,
            })
            .from(PlaylistsToSongs)
            .where(inArray(PlaylistsToSongs.songId, songIds))

          const songUrlById = keyBy(songUrls, (song) => song.songId)

          const lastRank = await getLastRankInPlaylist(playlistId)

          let currentRank = lastRank?.rank
            ? LexoRank.parse(lastRank.rank).genNext()
            : LexoRank.middle()

          const createdSongs = await tx
            .insert(PlaylistsToSongs)
            .values(
              songIds.map((songId) => {
                const song = {
                  playlistId,
                  songId,
                  songUrl: songUrlById[songId]?.songUrl || null,
                  rank: currentRank.toString(),
                }
                currentRank = currentRank.genNext()

                return song
              })
            )
            .onConflictDoNothing()
            .returning({ insertedId: PlaylistsToSongs.songId })

          if (createdSongs.length === 0) {
            throw new Error('Song already in playlist')
          }
        } else if (songs) {
          await Promise.all(
            chunk(songs, 50).map(async (chunk) => {
              const createdSongs = await tx
                .insert(Songs)
                .values(
                  chunk.map((song) => ({ ...song, updatedAt: new Date() }))
                )
                .onConflictDoUpdate({
                  target: [Songs.title, Songs.artist, Songs.album],
                  set: { updatedAt: new Date() },
                })
                .returning({ insertedId: Songs.id })

              const lastRank = await getLastRankInPlaylist(playlistId)

              let currentRank = lastRank?.rank
                ? LexoRank.parse(lastRank.rank).genNext()
                : LexoRank.middle()

              await tx
                .insert(PlaylistsToSongs)
                .values(
                  createdSongs.map((createdSong) => {
                    const song = {
                      playlistId,
                      songId: createdSong.insertedId,
                      rank: currentRank.toString(),
                    }
                    currentRank = currentRank.genNext()

                    return song
                  })
                )
                .onConflictDoUpdate({
                  target: [
                    PlaylistsToSongs.playlistId,
                    PlaylistsToSongs.songId,
                  ],
                  set: {
                    updatedAt: new Date(),
                  },
                })
            })
          )
        }
      })
    } catch (error) {
      logger.error(error)
      throw new Error(`Song${itemsCount === 1 ? '' : 's'} already in playlist`)
    }

    return true
  }

  @Query(() => Playlist)
  async playlist(
    @Arg('playlistId', () => ID) playlistId: string,
    @Ctx() ctx: Context
  ): Promise<Partial<Playlist>> {
    const session = ctx.session

    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const songs = await db
      .select()
      .from(Songs)
      .innerJoin(PlaylistsToSongs, eq(PlaylistsToSongs.songId, Songs.id))
      .where(eq(PlaylistsToSongs.playlistId, playlistId))

    const [userPlaylist] = await db
      .select()
      .from(Playlists)
      .innerJoin(Users, eq(Playlists.userId, Users.id))
      .where(eq(Playlists.id, playlistId))

    if (!userPlaylist) {
      throw new Error('Playlist not found')
    }

    return {
      id: playlistId,
      name: userPlaylist.playlists.name,
      type: userPlaylist.playlists.type,
      user: {
        id: userPlaylist.users.id,
        name: userPlaylist.users.name,
      },
      songs: songs.map((song) => ({
        id: song.songs.id,
        title: song.songs.title,
        artist: song.songs.artist,
        songUrl: song.playlistsToSongs.songUrl || undefined,
        rank: song.playlistsToSongs.rank || undefined,
        createdAt: song.playlistsToSongs.createdAt,
      })),
    }
  }

  @Mutation(() => Playlist)
  async updatePlaylist(
    @Arg('playlistId', () => ID) playlistId: string,
    @Arg('name') name: string,
    @Ctx() ctx: Context
  ): Promise<Playlist> {
    const session = ctx.session

    const { userId } = getTableColumns(Playlists)
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const [playlist] = await db
      .select({ userId })
      .from(Playlists)
      .where(eq(Playlists.id, playlistId))

    if (playlist.userId !== session.user.id) {
      throw new Error('Unauthorized')
    }

    await db.update(Playlists).set({ name }).where(eq(Playlists.id, playlistId))

    return {
      id: playlistId,
      name,
      user: {
        id: session.user.id,
      },
    }
  }
}
