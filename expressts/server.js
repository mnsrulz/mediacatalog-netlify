'use strict';
const serverless = require('serverless-http');
const appModule = require('../dist/app');
const _workingApp = appModule.createApp('/.netlify/functions/server')

console.log('bootstraping the serverjs file.');

module.exports = _workingApp;
module.exports.handler = serverless(_workingApp);