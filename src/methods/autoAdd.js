import spotifyApi from '../api/spotify';
import addTrack from './addTrack';
import request from 'request-promise';

const autoAdd = async timeout => {
  setTimeout(async () => {
    try {
      const parsedPlaylist = await spotifyApi.getPlaylist2();

      const trackIds = parsedPlaylist.map(item => item.track.id);

      const token = spotifyApi.getAccessToken();

      const playing = await request.get({
        headers: { Authorization: `Bearer ${token}` },
        url: 'https://api.spotify.com/v1/me/player/currently-playing'
      });

      if (!playing) return;

      const parsedPlaying = JSON.parse(playing);
      const playingIndex = parsedPlaylist.findIndex(pitem => pitem.track.id === parsedPlaying.item.id);

      const remainingTracksTime = parsedPlaylist.slice(playingIndex).reduce((acc, val) => acc + val.track.duration_ms, 0);

      if (playingIndex >= parsedPlaylist.length - 2) {

        const { body: { tracks: [ nextTrack ] } } = await spotifyApi.getRecommendations({ seed_tracks: trackIds.slice(-5) });
        addTrack(nextTrack);
      } else {
        autoAdd(remainingTracksTime - 5000);
      }
    } catch (e) {
      console.log('ERROR', e.message);
    }
  }, timeout);
};

export default autoAdd;
