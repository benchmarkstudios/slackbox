import request from 'request-promise';

const skip = (res, token) => async () => {
  try {
    await request.post({
      headers: { Authorization: `Bearer ${token}` },
      url: 'https://api.spotify.com/v1/me/player/next'
    });
    return res.send({
      attachments: [
        {
          text: 'Good Shout DJ',
          image_url: 'http://now-here-this.timeout.com/wp-content/uploads/2014/09/DJ-Trick-The-Helicopter.gif'
        }
      ]
    });
  } catch (e) {
    res.end(e.message);
  }
};

export default skip;
