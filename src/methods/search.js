import spotifyApi from '../api/spotify';

const search = res => async query => {
  try {
    const { body: { tracks: { items: tracks } } } = await spotifyApi.searchTracks(query, { limit: 10 });
    const messages = tracks.reduce((acc, val, ind) => {
      const artists = val.artists.reduce((acc, val, ind) => `${acc}${ind !== 0 ? ',' : ''} ${val.name}`, '');
      return `${acc}${artists} - ${val.name}\n`;
    }, 'One of these? \n');
    return res.send(messages);
  } catch (e) {
    res.send(e.message);
  }
};

export default search;
