'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');

/*
Little considerations
1. Use internal media id for the storage purposes and imdbid, tmdbid as a surrogate keys
2. Use typescript and leverage static typings
3. Use a separate data store than the existing mongodb store, so that this is mainly a playlist storage service and nothing else.
4. Leverage some authN/Z models to protect the api usage
5. Enhance this to model according to the users
*/


router.get('/media/:imdbId', async (req, res) => {
  const imdbId = req.params.imdbId;
  const data = {
    data: [
      {
        title: "Test1",
        source: "yt",
        imdbId,
        params: req.params
      }
    ]
  }
  res.json(data);
});

router.post('/media', async (req, res) => {
  //add media to the media list. It's just a way to add any imdbtitle to the system
  //parse the json, check if imdbid exists and if not then add it.
  const imdbId = req.params.imdbId;
  const data = {
    result: 'OK'
  }
  res.json(data);
});

router.post('/media/', async (req, res) => {
  //add media to the media list. It's just a way to add any imdbtitle to the system
  //parse the json, check if imdbid exists and if not then add it.
  const imdbId = req.params.imdbId;
  const data = {
    result: 'OK'
  }
  res.json(data);
});


router.get('/playlist', async (req, res) => {
  const data = {
    data: [
      {
        title: "4k"
      }
    ]
  }
  res.json(data);
});
router.get('/playlist/:playlistId', async (req, res) => {
  const data = {
    data: [
      {
        imdbId:"tt1919191",
        title: "some movie title"
      },
      {
        imdbId:"tt1919192",
        title: "another movie title"
      }
    ]
  }
  res.json(data);
});

router.post('/playlist', async (req, res) => {
  //push this to the data store. validate if the name is unique or not.
  const data = {
    result: 'Queued'
  }
  res.json(data);
});

router.post('/playlist/:playlistId', async (req, res) => {
  //we going to push this message to a queue for processing.
  const data = {
    result: 'OK'
  }
  res.json(data);
});


router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/movies/', (req, res) => res.json({ postBody: req.body }));

app.use(cors());
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.use('/pr1', (req, res) => res.json({ test: 123 }));

module.exports = app;
module.exports.handler = serverless(app);