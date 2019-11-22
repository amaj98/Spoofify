import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

import {AlbumRouter} from "./routes/album";
import {ArtistRouter} from "./routes/artist";
import {PlaylistRouter} from "./routes/playlist";
import {SongRouter} from "./routes/song";
import {UserRouter} from "./routes/user";

class Application {
    public app: express.Application;
    public port: number;
    public mongoose: mongoose.Mongoose;

    constructor() {
        this.app = express();
        this.port = +process.env.serverPort || 3000;
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.initCors();
        this.initDatabase();
    }
    // Starts the server on the port specified in the environment or on port 3000 if none specified.
    public start(): void {
        this.buildRoutes();
        this.app.listen(this.port, () => console.log("Server listening on port " + this.port + "!"));
    }

    // sets up to allow cross-origin support from any host.  You can change the options to limit who can access the api.
    // This is not a good security measure as it can easily be bypassed,
    // but should be setup correctly anyway.  Without this, angular would not be able to access the api it it is on
    // another server.
    public initCors(): void {
        this.app.use(function(req: express.Request, res: express.Response, next: any) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
    }
    // setup routes for the express server
    public buildRoutes(): void {
        const apiRouter: express.Router = express.Router();
        this.app.use("/api", apiRouter);
        apiRouter.use("/artist", new ArtistRouter().getRouter());
        apiRouter.use("/album", new AlbumRouter().getRouter());
        apiRouter.use("/playlist", new PlaylistRouter().getRouter());
        apiRouter.use("/song", new SongRouter().getRouter());
        apiRouter.use("/user", new UserRouter().getRouter());
    }

    // initializes connection to mongo database
    public initDatabase(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost:27017/SpotifyClone", {useNewUrlParser: true});
    }
}
new Application().start();
