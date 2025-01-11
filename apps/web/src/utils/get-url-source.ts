import { ytGetId } from './get-yt-url-id'

const getUrlSourceName = (url: string) => {
  if (
    url.startsWith('https://open.spotify.com/playlist/') ||
    url.startsWith('https://open.spotify.com/track/')
  ) {
    return 'spotify'
  }

  if (ytGetId(url)) {
    return 'youtube'
  }

  if (
    url.match(
      /^https?:\/\/(www\.|m\.)?soundcloud\.com\/[a-z0-9](?!.*?(-|_){2})[\w-]{1,23}[a-z0-9](?:\/.+)?$/
    )
  ) {
    return 'soundcloud'
  }
}

export { getUrlSourceName }
