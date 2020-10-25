import express from "express";
import * as bodyParser from "body-parser";

import { ApplicationRoutes } from "./routes/appRoutes";
import mongoose from "mongoose";
import basicAuth from "express-basic-auth";
import cors from "cors";

const mongoUrl: string = process.env.MONGODB_URI || '';

class App {
  // public app: express.Application = express();
  // public applicationRoutes: ApplicationRoutes = new ApplicationRoutes();  
  

  // constructor(baseUrl: string) {
  //   this.config();
  //   this.authSetup();

  //   this.app.use(baseUrl || "/", this.applicationRoutes.getRoutes());

  //   //this.mongoSetup();
  // }

  public static createApp(baseUrl: string): Express.Application {
    const app = express();
    const applicationRoutes = new ApplicationRoutes();
    //config
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    //auth
    const userName = process.env.adminUserName || "admin";
    const password = process.env.adminPassword || "admin";
    const realm = process.env.realm || "media-catalog-directory";

    let users: { [username: string]: string } = {};
    users[userName] = password;
    app.use(basicAuth({
      users: users,
      challenge: true,
      realm: realm,
    }));

    //db init
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    //setup routes
    app.use(baseUrl || "/", applicationRoutes.getRoutes());

    return app;
  }

  // private config(): void {
  //   this.app.use(cors());
  //   this.app.use(bodyParser.json());
  //   this.app.use(bodyParser.urlencoded({ extended: false }));
  //   this.app.use((req, res, next) => {
  //     console.log("req comes in here...");
  //     next();
  //   });
  //   // serving static files
  //   // this.app.use(express.static('public'));
  // }

  // private mongoSetup(): void {
  //     // mongoose.Promise = global.Promise;
  //     mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  // }

  // private authSetup(): void {
  //   const userName = process.env.adminUserName || "admin";
  //   const password = process.env.adminPassword || "admin";
  //   const realm = process.env.realm || "media-catalog-directory";

  //   let users: { [username: string]: string } = {};
  //   users[userName] = password;

  //   this.app.use(basicAuth({
  //     users: users,
  //     challenge: true,
  //     realm: realm,
  //   }));
  // }
}

export function createApp(baseUrl: string) {
  return App.createApp(baseUrl);
}
