# slackbox
Group playlist collaboration through Slack using the following command:

    /jukebox Track - Artist
    
You'll either get a `Track added.` message on success, or a fail and the response message from Spotify's API.

Brought to you by the lovely people at [Benchmark](http://benchmark.co.uk).

##Environment variables

These can either be stored in a `.env` or set up as config variables in Heroku.

### SLACK_TOKEN

The token from Slack's Slash Command.

### SPOTIFY_KEY

Your Spotify application key (a.k.a Client ID).

### SPOTIFY_SECRET

Your Spotify application secret (a.k.a Client Secret).

### SPOTIFY_USERNAME

Your Spotify username.

### SPOTIFY_PLAYLIST_ID

Your playlist identifier. Found by locating your playlist on [play.spotify.com](https://play.spotify.com) then note the hash in the URL.

### SPOTIFY_REDIRECT_URI

URL to redirect to once your user has allowed the application's permissions. It is recommended you set this to whatever the URL of your app is and append `/callback` to the end.
