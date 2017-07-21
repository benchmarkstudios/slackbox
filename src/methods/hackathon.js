import spotifyApi from '../api/spotify';

const hackathon = res => async query => {
  console.log(query)

  const { body: { tracks: { items: tracks } } } = await spotifyApi.searchTracks(query);
  if (tracks.length === 0) {
    throw 'Could not find that track.'
  }
  console.log(tracks)
  const [ track ] = tracks;
  console.log(track)
  await spotifyApi.addTracksToPlaylist(process.env.SPOTIFY_USERNAME, '1YA1RrRjqvxWVrw7WzoCqW', [`spotify:track:${track.id}`]);
  console.log('added')
  const message = `Track added: *${track.name}* by *${track.artists[0].name}*`;
  return res.send(message)
}

export default hackathon;
