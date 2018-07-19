import spotifyApi from '../api/spotify';
import autoAdd from './autoAdd';

const addTrack = async (track, recursive = true) => {

  await spotifyApi.addTracksToPlaylist2(track);
  if (recursive) {
    autoAdd(track.duration_ms - 5000);
  }
  return track;
};

export default addTrack;
