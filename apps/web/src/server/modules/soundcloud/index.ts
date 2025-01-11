import SoundCloud from 'soundcloud.ts'

const soundCloudAPI = new SoundCloud()

export const soundcloud = {
  getTrack: async (urlOrId: string) => {
    return await soundCloudAPI.tracks.getV2(urlOrId)
  },
}
