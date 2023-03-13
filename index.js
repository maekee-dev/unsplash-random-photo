const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const fetch = require('node-fetch')

require('dotenv').config()

const headers = new Headers();
headers.append('Content-Type', 'application/json')
headers.append('Accept-Version', 'v1')
headers.append('Authorization', 'Client-ID ' + process.env.ACCESS_KEY)

const getPicture = () => {
  return fetch('https://api.unsplash.com/photos/random?orientation=landscape&count=1', 
  {
      method: 'GET',
      headers: headers
  })
  .then(response => response.json())
  .then(data => {
    let createdValue = data[0].created_at
    createdValue = createdValue.slice(0,10)
    const pictureData = {
      url: data[0].urls.full,
      views: data[0].views,
      downloads: data[0].downloads,
      author: data[0].user.name,
      created: createdValue,
      color: data[0].color,
      alt_description: data[0].alt_description,
      description: data[0].description,
      username: data[0].user.username,
      download_location: data[0].links.html
    }
    return pictureData;
  })
  .catch(error => console.error('Si è verificato un errore', error))
}

const app = express() 
app.use(serveStatic(path.join(__dirname, 'public'))) 
app.set('views', __dirname + '/public/view/');
app.set('view engine', 'ejs');

app.use('', (req, res, next) => {
  getPicture()
    .then(result => {
      res.locals.data = result;
      next();
    })
    .catch(error => {
      console.error('Si è verificato un errore:', error);
      next(error);
    });
});

app.get('', (req, res) => {
    res.render('index', {data: res.locals.data})
})

const PORT = process.env.PORT
app.listen(PORT, () => console.info(`App listening on port ${PORT}`))