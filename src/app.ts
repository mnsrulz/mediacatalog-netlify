import express from "express";
import * as bodyParser from "body-parser";

import { ApplicationRoutes } from "./routes/appRoutes";
import mongoose from "mongoose";
import cors from "cors";
import configs from "./configs/config";

import passport from "passport";

var GoogleTokenStrategy = require('passport-google-id-token');
import { BasicStrategy } from 'passport-http';

const mongoUrl: string = configs.mongoUri;

class App {

  public static createApp(baseUrl: string): Express.Application {
    const app = express();
    const applicationRoutes = new ApplicationRoutes();
    //config
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    //auth
    const userName = process.env.adminUserName || "admin";
    const secretPassword = process.env.adminPassword || "admin";
    const googleClientId = process.env.googleClientId || '345350504609-1moo0gfi27h0jj2qaim5ed1iohgprs99.apps.googleusercontent.com';
    passport.use(new BasicStrategy(
      function (username, password, done) {
        if (username === userName && password === secretPassword) {
          return done(null, {
            username
          });
        } else {
          return done(null, false);
        }
      }
    ));

    passport.use(new GoogleTokenStrategy({
      clientID: googleClientId
    },
      function (parsedToken: any, googleId: any, done: any) {        
        return done(null, {
          name: parsedToken.name,
          googleId
        });
      }
    ));

    app.use(passport.authenticate(['basic', 'google-id-token'], { session: false }));

    //db init
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    //setup routes
    app.use(baseUrl || "/", applicationRoutes.getRoutes());

    //global error handler
    app.use((err: Error, req: any, res: any, next: any) => {
      res.status(500).json({
        status: 'error',
        message: err.message,
      });
    });
    return app;
  }
}

export function createApp(baseUrl: string) {
  return App.createApp(baseUrl);
}
