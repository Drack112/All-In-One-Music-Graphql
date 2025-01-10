import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType('song')
export class Song {
  @Field()
  title: string

  @Field()
  artist: string

  @Field({ nullable: true })
  album?: string

  @Field({ nullable: true })
  playcount?: string

  @Field({ nullable: true })
  year?: string

  @Field({ nullable: true })
  duration?: string

  @Field({ nullable: true })
  genre?: string

  @Field(() => Int, { nullable: true })
  playlistId: number | null
}

@ObjectType('userSong')
export class UserSong extends Song {
  @Field()
  id: string

  @Field({ nullable: true })
  songUrl?: string

  @Field(() => String, { nullable: true })
  rank?: string

  @Field(() => String, { nullable: true })
  createdAt?: Date
}
