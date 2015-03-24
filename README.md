# slackbox
Group playlist collaboration through Slack. Brought to you by the lovely people at [Benchmark](http://benchmark.co.uk).

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

##Installation

First you'll want to create your Slack Slash Command, which you can do by going to `https://replace-with-your-group.slack.com` and adding a Slash Command Integration.

Make a note of the `token`, as you'll need it later.

###Spotify

Head over to [Spotify's Developer Site](http://developer.spotify.com) and create a new Application. Make sure you add whatever slackbox's callback URI as a valid callback URI. If you're running locally, this will be `http://localhost:5000/callback` or on Heroku `http://app-name.herokuapp.com/callback`

Make a note of the `callback URI` too, as you'll need this later as well.

###Environment variables

Once you've cloned slackbox or hit the "Deploy with Heroku" button you'll need to setup the following environment variables. These can either be stored in a `.env` or set up as config variables in Heroku.

* `SLACK_TOKEN` - The token from Slack's Slash Command.
* `SPOTIFY_KEY` - Your Spotify application key (a.k.a Client ID).
* `SPOTIFY_SECRET` - Your Spotify application secret (a.k.a Client Secret).
* `SPOTIFY_USERNAME` - Your Spotify username.
* `SPOTIFY_PLAYLIST_ID` - Your playlist identifier. Found by locating your playlist on [play.spotify.com](https://play.spotify.com) then note the hash in the URL.
* `SPOTIFY_REDIRECT_URI` - URL to redirect to once your user has allowed the application's permissions.

###Authentication

Visit your slackbox's home page to authenticate yourself with Spotify and you should be all set!
