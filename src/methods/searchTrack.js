import { rickroll, bieber } from './extras';
import spotifyApi from '../api/spotify';
import addTrack from './addTrack';

const searchTrack = res => async query => {
  try {
    const { body: { tracks: { items: tracks } } } = await spotifyApi.searchTracks(query);

    if (tracks.length === 0) {
      throw 'Could not find that track.';
    }
    const [ track ] = tracks;
    if (track.name === 'Never Gonna Give You Up') {
      return rickroll(res);
    }
    if (track.artists[0].name === 'Justin Bieber') {
      await spotifyApi.addTracksToPlaylist2(track);
      return bieber(res, `Track added: ${track.name} by ${track.artists[0].name}`);
    }

    await addTrack(track);
    const message = `Track added: *${track.name}* by *${track.artists[0].name}*`;
    return res.send(message);
  } catch (e) {
    res.send(e.message);
  }
};

export default searchTrack;
