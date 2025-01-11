import { type DefaultJWT } from '@auth/core/jwt'
import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string & DefaultSession['user']
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    id?: string
  }
}

export type DroppableEntity =
  | DataRef<{ name: string; id: string }>
  | DataRef<{ items: PlayableSong[] } & SortableData>
