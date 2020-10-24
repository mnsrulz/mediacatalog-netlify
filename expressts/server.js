'use strict';
// const express = require('express');
// const path = require('path');
const serverless = require('serverless-http');

const app = require('../dist/app')
// const app = express();

// const bodyParser = require('body-parser');
// const router = express.Router();
// const cors = require('cors');


module.exports = app;
module.exports.handler = serverless(app);