import getArtistTitle from 'get-artist-title'
import { sanitizeSongTitle } from './song-titles.helper'

export const formatYoutubeTitle = (title: string, author: string) => {
  // remove ":"
  const formattedTitle = title.replace(/(?<=\s|^):(\w+)/g, '$1')

  const [songArtist, songTitle] = getArtistTitle(formattedTitle, {
    defaultArtist: author,
    defaultTitle: title,
  }) || ['Unknown', 'Unknown']

  return {
    // replace " - Topic" with ""
    artist: songArtist.replace(/ - Topic$/, ''),
    title: sanitizeSongTitle(songTitle),
  }
}
