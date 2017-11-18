import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId     : process.env.SPOTIFY_KEY,
  clientSecret : process.env.SPOTIFY_SECRET,
  redirectUri  : process.env.SPOTIFY_REDIRECT_URI
});

spotifyApi.addTracksToPlaylist2 = (tracks) => {
  const tracksArr = Array.isArray(tracks) ? tracks : [tracks];
  spotifyApi.addTracksToPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, tracksArr.map(track => `spotify:track:${track.id}`)) 
}


const spotifyApi.getPlaylist2 = async (playlist = [], offset = 0, limit = 100) => {
  const { body: { tracks: parsedPlaylist } } = await spotifyApi.getPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, { offset, limit });
  playlist.push(parsedPlaylist.items);
  if (parsedPlaylist.next) return spotifyApi.getPlaylist2(playlist, offset + limit, limit);
  return playlist;
}

export default spotifyApi;