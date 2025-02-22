import { playlistType } from '@/constants'
import type { Context } from '@/types'
import { chunk, isEmpty, keyBy, map } from 'lodash'
import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'
import { LexoRank } from 'lexorank'

import { and, desc, eq, getTableColumns, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { getLastRankInPlaylist, Playlist } from './entities/playlist'
import { Playlists, PlaylistsToSongs, Songs, Users } from '@/db/schema'
import { SongInput } from '../song/entities/song'
import { logger } from '@/server/logger'
import { getUrlSourceName } from '@/utils/get-url-source'
import { getExternalPlaylistTracks } from '@/utils/get-external-playlist-tracks'
import { createId } from '@paralleldrive/cuid2'
import { invidious } from '@/server/modules/invidious'
import { formatYoutubeTitle } from '@/utils/format-youtube-title'

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

  @Mutation(() => Boolean)
  async updatePlaylistSongRank(
    @Ctx() ctx: Context,
    @Arg('playlistId', () => ID) playlistId: string,
    @Arg('songId', () => ID) songId: string,
    @Arg('rank') rank: string
  ): Promise<boolean> {
    const session = ctx.session

    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const { userId } = getTableColumns(Playlists)

    const [playlist] = await db
      .select({
        userId,
      })
      .from(Playlists)
      .where(eq(Playlists.id, playlistId))

    if (playlist.userId !== session.user.id) {
      throw new Error('Unauthorized')
    }

    await db
      .update(PlaylistsToSongs)
      .set({
        rank,
      })
      .where(
        and(
          eq(PlaylistsToSongs.playlistId, playlistId),
          eq(PlaylistsToSongs.songId, songId)
        )
      )

    return true
  }

  @Mutation(() => Boolean)
  async removeFromPlaylist(
    @Arg('playlistId', () => ID) playlistId: string,
    @Arg('songId', () => ID) songId: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const session = ctx.session

    const { userId } = getTableColumns(Playlists)

    const [playlist] = await db
      .select({
        userId,
      })
      .from(Playlists)
      .where(eq(Playlists.id, playlistId))

    if (!session?.user || playlist.userId !== session.user.id) {
      throw new Error('Unauthorized')
    }

    await db
      .delete(PlaylistsToSongs)
      .where(
        and(
          eq(PlaylistsToSongs.playlistId, playlistId),
          eq(PlaylistsToSongs.songId, songId)
        )
      )

    return true
  }

  @Mutation(() => Playlist)
  async importPlaylist(
    @Ctx() ctx: Context,
    @Arg('url') url: string,
    @Arg('playlistId', () => ID, { nullable: true }) playlistId?: string
  ): Promise<Playlist> {
    const urlSourceName = getUrlSourceName(url)

    if (!urlSourceName) {
      throw new Error('Invalid URL')
    }

    const session = ctx.session

    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const [existingPlaylist] = playlistId
      ? await db
          .select({
            id: Playlists.id,
          })
          .from(Playlists)
          .where(
            and(
              eq(Playlists.id, playlistId),
              eq(Playlists.userId, session.user.id)
            )
          )
      : [null]

    if (playlistId && !existingPlaylist) {
      throw new Error('Playlist not found')
    }

    const tracks = await getExternalPlaylistTracks(url, urlSourceName)

    if (tracks.length === 0) {
      throw new Error('No tracks found in url')
    }

    const playlistName = `playlist-${createId()}`

    const createdPlaylistId = await db.transaction(async (tx) => {
      const [createdPlaylist] = existingPlaylist
        ? [{ insertedId: existingPlaylist.id }]
        : await tx
            .insert(Playlists)
            .values({
              name: playlistName,
              userId: session?.user.id,
              updatedAt: new Date(),
            })
            .returning({ insertedId: Playlists.id })

      try {
        await Promise.all(
          chunk(tracks, 50).map(async (chunk) => {
            const createdSongs = await tx
              .insert(Songs)
              .values(chunk.map((song) => ({ ...song, updatedAt: new Date() })))
              .onConflictDoUpdate({
                target: [Songs.title, Songs.artist, Songs.album],
                set: { updatedAt: new Date() },
              })
              .returning({
                insertedId: Songs.id,
                insertedTitle: Songs.title,
                insertedArtist: Songs.artist,
              })

            const songsByTitleArtist = keyBy(
              chunk,
              (song) => `${song.artist}${song.title}`
            )

            const lastRank = await getLastRankInPlaylist(
              createdPlaylist.insertedId
            )

            let currentRank = lastRank?.rank
              ? LexoRank.parse(lastRank.rank).genNext()
              : LexoRank.middle()

            await tx.insert(PlaylistsToSongs).values(
              createdSongs.map((createdSong) => {
                const song = {
                  playlistId: createdPlaylist.insertedId,
                  songId: createdSong.insertedId,
                  songUrl:
                    songsByTitleArtist[
                      `${createdSong.insertedArtist}${createdSong.insertedTitle}`
                    ]?.url || null,
                  rank: currentRank.toString(),
                }
                currentRank = currentRank.genNext()

                return song
              })
            )
          })
        )
      } catch (error) {
        logger.error(error)
        throw new Error('Error importing playlist or all songs already exist')
      }

      return createdPlaylist.insertedId
    })

    return {
      id: createdPlaylistId,
      name: playlistName,
      user: {
        id: session.user.id,
      },
    }
  }

  @Mutation(() => Boolean)
  async deletePlaylist(
    @Arg('playlistId', () => ID) playlistId: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const session = ctx.session

    const { userId } = getTableColumns(Playlists)

    const [playlist] = await db
      .select({ userId })
      .from(Playlists)
      .where(eq(Playlists.id, playlistId))

    if (!session?.user || playlist.userId !== session.user.id) {
      throw new Error('Unauthorized')
    }

    await db
      .delete(PlaylistsToSongs)
      .where(eq(PlaylistsToSongs.playlistId, playlistId))

    return true
  }

  @Mutation(() => Playlist)
  async createSongRadio(
    @Ctx() ctx: Context,
    @Arg('songId', () => ID, { nullable: true }) songId?: string,
    @Arg('songTitle', { nullable: true }) songTitle?: string,
    @Arg('songArtist', { nullable: true }) songArtist?: string
  ): Promise<Playlist> {
    const session = ctx.session

    if (!session?.user) {
      throw new Error('Unauthorized')
    }
    if (!songId && !songTitle) {
      throw new Error('No song provided')
    }

    const { id: playlistId, name } = getTableColumns(Playlists)
    const { id: colSongId } = getTableColumns(Songs)

    const [existingSong] =
      songTitle && songArtist && !songId
        ? await db
            .select({ id: colSongId })
            .from(Songs)
            .where(
              and(eq(Songs.title, songTitle), eq(Songs.artist, songArtist))
            )
        : [null]

    const existingSongId = songId || existingSong?.id

    if (existingSongId) {
      const [radioPlaylist] = await db
        .select({
          playlistId,
          name,
        })
        .from(Playlists)
        .where(
          and(
            eq(Playlists.userId, session.user.id),
            eq(Playlists.radioSongId, existingSongId)
          )
        )

      if (radioPlaylist) {
        return {
          id: radioPlaylist.playlistId,
          name: radioPlaylist.name,
        }
      }
    }

    const { data: videoData } = await invidious.getVideos({
      query: `${songArtist} - ${songTitle}`,
    })

    const video = videoData[0]

    if (!video) {
      throw new Error('Video not found')
    }

    const { data: radioData } = await invidious.getMix({
      videoId: video.videoId,
    })

    if (!radioData) {
      throw new Error('Could not create radio from song :(')
    }

    const songs = radioData.videos.map((video) =>
      formatYoutubeTitle(video.title, video.author)
    )

    const radioPlaylistName = `${songArtist} Radio`

    const createdRadioPlaylist = await db.transaction(async (tx) => {
      const [createdRadioSong] = await tx
        .insert(Songs)
        .values({
          title: songTitle!,
          artist: songArtist!,
        })
        .onConflictDoUpdate({
          target: [Songs.title, Songs.artist, Songs.album],
          set: { updatedAt: new Date() },
        })
        .returning({ insertedId: Songs.id })

      const [createdPlaylist] = await tx
        .insert(Playlists)
        .values({
          name: radioPlaylistName,
          userId: session.user.id,
          radioSongId: createdRadioSong.insertedId,
          type: playlistType.RADIO,
          updatedAt: new Date(),
        })
        .returning({ insertedId: Playlists.id })

      await Promise.all(
        chunk(songs, 50).map(async (chunk) => {
          const createdSongs = await tx
            .insert(Songs)
            .values(chunk)
            .onConflictDoUpdate({
              target: [Songs.title, Songs.artist, Songs.album],
              set: { updatedAt: new Date() },
            })
            .returning({ insertedId: Songs.id })

          await tx
            .insert(PlaylistsToSongs)
            .values(
              createdSongs.map((song) => ({
                playlistId: createdPlaylist.insertedId,
                songId: song.insertedId,
              }))
            )
            .onConflictDoNothing()
        })
      )

      return createdPlaylist
    })

    return {
      id: createdRadioPlaylist.insertedId,
      name: radioPlaylistName,
      user: {
        id: session.user.id,
      },
    }
  }

  @Mutation(() => Playlist)
  async createPlaylist(
    @Ctx() ctx: Context,
    @Arg('name', { nullable: true }) name?: string
  ): Promise<Playlist> {
    const session = ctx.session

    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const playlistName = name ?? `playlist-${createId()}`

    const [createdPlaylist] = await db
      .insert(Playlists)
      .values({
        name: playlistName,
        userId: session.user.id,
        updatedAt: new Date(),
      })
      .returning({ insertedId: Playlists.id })

    return {
      id: createdPlaylist.insertedId,
      name: playlistName,
      user: {
        id: session.user.id,
      },
    }
  }
}
