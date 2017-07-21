if (process.env.NODE_ENV !== 'production') require('dotenv').load();

import express from 'express';
import bodyParser from 'body-parser';
import spotifyApi from './api/spotify';
import { hackathon, searchTrack, skip, nowPlaying, search, upNext } from './methods';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

let accessToken;
const refresh = t => {
  console.log('timeout', t)
  setTimeout(async () => {
    try {
      const token = await spotifyApi.refreshAccessToken()
      console.log('refresh token', tokens)
      accessToken = token.body['access_token']
      spotifyApi.setAccessToken(accessToken);
      if (token.body['refresh_token']) {
        spotifyApi.setRefreshToken(token.body['refresh_token']);
      }
      refresh((token.body.expires_in - 60) * 1000)
    } catch (e) {
      console.log(e.message)
      console.log('Could not refresh access token. You probably need to re-authorise yourself from your app\'s homepage.')
    }
  }, t)
}

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

app.get('/callback', async (req, res) => {
  try {
    const data = await spotifyApi.authorizationCodeGrant(req.query.code);
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    return res.redirect('/');
  } catch (err) {
    return res.send(err);
  }
});

app.use('/store', (req, res, next) => {
  if (req.body.token !== process.env.SLACK_TOKEN) {
    return slack(res.status(500), 'Cross site request forgerizzle!');
  }
  next();
});

app.post('/store', (req, res) => {
  spotifyApi.refreshAccessToken()
  try {
    const accessToken = spotifyApi.getAccessToken();
    const { text } = req.body;
    if (text.trim().length === 0) {
      return res.send('Enter the name of a song and the name of the artist, separated by a "-"\nExample: Blue (Da Ba Dee) - Eiffel 65');
    }
    if (text.indexOf('hackathon') === 0 || text.indexOf('HACKATHON') === 0) {
      const t = text.split('hackathon ')[1];
      const pieces = t.split(' - ');
      const query = `artist:${pieces[0].trim()} track:${pieces[1].trim()}`;
      return hackathon(res)(query);
    }
    if (text.indexOf('now playing') === 0) {
      return nowPlaying(res)(accessToken);
    }
    if (text.indexOf('skip') === 0 ) {
      return skip(res)(accessToken);
    }
    if (text.indexOf('up next') === 0 ) {
      return upNext(res)(accessToken);
    }
    if(text.indexOf(' - ') === -1) {
      return search(res)(text);
    }
    const pieces = text.split(' - ');
    const query = `artist:${pieces[0].trim()} track:${pieces[1].trim()}`;
    searchTrack(res)(query);
  } catch (e) {
    res.end(e.message);
  }
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));
