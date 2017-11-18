import spotifyApi from '../api/spotify';
import addTrack from './addTrack';
import request from 'request-promise';

const autoAdd = async (timeout) => {
  setTimeout(async () => {
    try {
      const { body: { tracks: parsedPlaylist } } = await spotifyApi.getPlaylist2();
      const trackIds = parsedPlaylist.items.map(item => item.track.id);
      const token = spotifyApi.getAccessToken();
      const playing = await request.get({
        headers: { Authorization: `Bearer ${token}` },
        url: 'https://api.spotify.com/v1/me/player/currently-playing'
      });

      const parsedPlaying = JSON.parse(playing);
      const playingIndex = parsedPlaylist.items.findIndex(pitem => pitem.track.id === parsedPlaying.item.id);
      const remainingTracksTime = parsedPlaylist.items.slice(playingIndex).reduce((acc, val) => acc + val.track.duration_ms, 0);
      if (playingIndex >= parsedPlaylist.items.length - 2) {
        const { body: { tracks: { items: [ nextTrack ] } } } = await spotifyApi.getRecommendations({ seed_tracks: trackIds.slice(-5) });
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
