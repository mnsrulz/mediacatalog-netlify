import express from "express";
import * as bodyParser from "body-parser";

import { ApplicationRoutes } from "./routes/appRoutes";
import mongoose from "mongoose";
import basicAuth from "express-basic-auth";
import cors from "cors";

const mongoUrl: string = process.env.MONGODB_URI || 'mongodb+srv://testuser:BCO6HUx3UU5W58Gk@cluster0.9m1ac.mongodb.net/mediacatalog?retryWrites=true&w=majority';

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
    const realm = process.env.realm || "media-catalog-api";

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
