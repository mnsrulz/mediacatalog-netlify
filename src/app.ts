import express from "express";
import * as bodyParser from "body-parser";

import { Routes } from "./routes/appRoutes";
// import mongoose from "mongoose";
import basicAuth from 'express-basic-auth';
import cors from 'cors';

class App {

    public app: express.Application = express();
    public routePrv: Routes = new Routes();
    public mongoUrl: string = process.env.MONGODB_URI || '';
    
    constructor() {
        this.config();
        this.authSetup();
        //this.mongoSetup();        
        this.routePrv.routes(this.app);
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use((req,res, next)=>{
console.log('req comes in here...');
next();
        });
        // serving static files         
        // this.app.use(express.static('public'));
    }

    // private mongoSetup(): void {
    //     // mongoose.Promise = global.Promise;
    //     mongoose.connect(this.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    // }

    private authSetup(): void {
        const userName = process.env.adminUserName || 'admin';
        const password = process.env.adminPassword || 'admin';
        const realm = process.env.realm || 'media-catalog-directory';

        let users: { [username: string]: string } = {};
        users[userName] = password;

        this.app.use(basicAuth({
            users: users,
            challenge: true,
            realm: realm,
        }));

    }

}

export default new App().app;