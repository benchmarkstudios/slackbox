var dotenv        = require('dotenv').load();
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi    = new SpotifyWebApi({
  clientId     : process.env.SPOTIFY_KEY,
  clientSecret : process.env.SPOTIFY_SECRET,
  redirectUri  : process.env.SPOTIFY_REDIRECT_URI
});
var scopes = ['playlist-modify-public', 'playlist-modify-private'];
var code   = '';

var auth = function() {
  spotifyApi.authorizationCodeGrant(code)
    .then(function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
    }, function(err) {
      var authoriseURL = spotifyApi.createAuthorizeURL(scopes, console.time());
      console.log('You probably need to authenticate', authoriseURL);
    });
};

var findTrack = function(track) {
  spotifyApi.searchTracks(track)
    .then(function(data) {
      var results = data.body.tracks.items;
      var trackId = results[0].id;
      return addToPlaylist(trackId);
    }, function(err) {
      console.log('No track found', err);
    });
};

var addToPlaylist = function(trackId) {
  spotifyApi.addTracksToPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, ['spotify:track:' + trackId])
    .then(function(data) {
      console.log('Track added.');
    }, function(err) {
      console.error(err);
    });
};

findTrack('Bohemian Rhapsody - Queen');