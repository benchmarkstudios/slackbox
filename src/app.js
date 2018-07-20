import express from 'express';
import bodyParser from 'body-parser';
import spotifyApi from './api/spotify';
import { clearPlaylist, nowPlaying, search, searchTrack, skip, playlist, upNext } from './methods';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


const refreshToken = () =>
  spotifyApi.refreshAccessToken()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
    if (data.body['refresh_token']) {
      spotifyApi.setRefreshToken(data.body['refresh_token']);
    }
    return data.body['access_token'];
    setTimeout(refreshToken, (expires_in - 30) * 1000);
  });


const docs = `
Enter the name of a song and the name of the artist separated by a -
\nExample: Craig David - 7 days

Other Commands:
*clear playlist*: will empty the paylist
*now playing*: show currently playing
*skip*: skip the current track
*up next* / *next up*: shows the current and queued tracks
*playlist*: provides a link to the playlist in your browser
`;

app.get('/', async (req, res) => {
  if (spotifyApi.getAccessToken()) {
    return res.send('You are logged in.');
  }
  return res.send('<a href="/authorise">Authorise</a>');
});

app.get('/authorise', async (req, res) => {
  const scopes = [ 'playlist-modify-public', 'playlist-modify-private', 'user-read-playback-state', 'user-modify-playback-state' ];
  const state  = new Date().getTime();
  const authoriseURL = await spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authoriseURL);
});

app.get('/callback', async (req, res) =>
  spotifyApi.authorizationCodeGrant(req.query.code)
    .then(data => {
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      refreshToken();
      return res.redirect('/');
    })
    .catch(res.send));

app.use('/store', (req, res, next) => {
  if (process.env.NODE_ENV !== 'development' && req.body.token !== process.env.SLACK_TOKEN) {
    return res.status(500);
  }
  next();
});


const commandToFn = {
  ['clear playlist']: clearPlaylist,
  ['now playing']: nowPlaying,
  ['skip']: skip,
  ['up next']: upNext,
  ['next up']: upNext,
  ['playlist']: playlist
};

app.post('/store', async (req, res) => {
  try {

    const { text } = req.body;

    if (text.trim().length === 0) {
      return res.send(docs);
    }

    if (commandToFn[text])
      return commandToFn[text](res, accessToken)(text);

    if (text.indexOf(' - ') === -1) {
      return search(res)(text);
    }

    const pieces = text.split(' - ');
    const query = `artist:${pieces[0].trim()} track:${pieces[1].trim()}`;
    searchTrack(res)(query);
  } catch (e) {
    res.end(e.message);
  }
});

app.set('port', (process.env.PORT || 5001));
app.listen(app.get('port'));
