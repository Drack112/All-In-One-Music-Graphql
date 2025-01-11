import { TrackGetInfo } from '@/server/modules/lastfm/types'
import { groupBy } from 'lodash'
import { coalesce } from './coalesce'

export const getCoverImage = (
  images: TrackGetInfo['track']['album']['image']
) => {
  if (!images) {
    return undefined
  }

  const coverImages = groupBy(images, 'size')

  const imageSizes = ['extralarge', 'large', 'medium']

  const defaultValue = [{ '#text': '' }]

  const [coverImage] = coalesce(coverImages, imageSizes, defaultValue)

  return coverImage['#text']
}
