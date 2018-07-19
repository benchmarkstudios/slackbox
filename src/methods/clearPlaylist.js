import spotifyApi from '../api/spotify';

const clearPlaylist = res => async () => {
  await spotifyApi.clearPlaylist();
  res.send('playlist cleared');
};

export default clearPlaylist;