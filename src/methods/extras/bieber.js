const bieber = (res, message) => {
  res.send({
    attachments: [
      {
        text: message,
        image_url: 'https://res.cloudinary.com/jpress/image/fetch/https://www.wow247.co.uk/wp-content/uploads/2016/04/bieber-winker.gif'
      }
    ]
  })
}

export default bieber;
