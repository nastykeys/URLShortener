require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const dns = require('node:dns')
const URL = require('url').URL
const app = express();

const urls = {}
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded())

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.post('/api/shorturl', (req, res) => {
  let newUrl = new URL(req.body.url)
  dns.lookup(newUrl.hostname, err => {
    if (err) {
      res.json({error: 'invalid url'})
    }else {
      let shorturl = Math.floor(Math.random() * 1000)
      if(shorturl in urls) shorturl = Math.floor(Math.random() * 1000)

      urls[shorturl] = req.body.url
      console.log(urls)
      res.json({original_url: req.body.url, short_url: shorturl})
    }
  })
})

app.get('/api/shorturl/:short?', (req, res) => {
  if(req.params.short in urls) res.redirect(urls[req.params.short])
})