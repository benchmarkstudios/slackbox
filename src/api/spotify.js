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

spotifyApi.getPlaylist2 = () => spotifyApi.getPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID) 


export default spotifyApi;