"use strict";
import serverless from "serverless-http";
import { createApp } from "../app";

const _workingApp = createApp("/.netlify/functions/server");

console.log("bootstraping the serverjs file.");

module.exports = _workingApp;
module.exports.handler = serverless(_workingApp);
