const rickroll = res => {
  res.send({
    attachments: [
      {
        text: '',
        image_url: 'http://vignette1.wikia.nocookie.net/creation/images/f/fa/Best-rick-roll-gif-577.gif/revision/latest?cb=20160515183412'
      }
    ]
  })
}

export default rickroll;
