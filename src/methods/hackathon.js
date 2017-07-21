import spotifyApi from '../api/spotify';

const hackathon = res => async query => {
  console.log(query)

  const { body: { tracks: { items: tracks } } } = await spotifyApi.searchTracks(query);
  if (tracks.length === 0) {
    throw 'Could not find that track.'
  }
  const [ track ] = tracks;
  await spotifyApi.addTracksToPlaylist(process.env.SPOTIFY_USERNAME, '1kdf8FDIidEB6NpHTd5Yil', [`spotify:track:${track.id}`]);
  const message = `Track added: *${track.name}* by *${track.artists[0].name}*`;
  return res.send(message)
}

export default hackathon;
