'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');

router.get('/movies', async (req, res) => {
  const data = {
    data: [
      {
        title: "Test1",
        source: "yt"
      }
    ]
  }
  res.json(data);
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/movies/', (req, res) => res.json({ postBody: req.body }));

app.use(cors());
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);