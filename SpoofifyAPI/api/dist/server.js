"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const album_1 = require("./routes/album");
const artist_1 = require("./routes/artist");
const playlist_1 = require("./routes/playlist");
const song_1 = require("./routes/song");
const user_1 = require("./routes/user");
class Application {
    constructor() {
        this.app = express_1.default();
        this.port = +process.env.serverPort || 3000;
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(body_parser_1.default.json());
        this.initCors();
        this.initDatabase();
    }
    // Starts the server on the port specified in the environment or on port 3000 if none specified.
    start() {
        this.buildRoutes();
        this.app.listen(this.port, () => console.log("Server listening on port " + this.port + "!"));
    }
    // sets up to allow cross-origin support from any host.  You can change the options to limit who can access the api.
    // This is not a good security measure as it can easily be bypassed,
    // but should be setup correctly anyway.  Without this, angular would not be able to access the api it it is on
    // another server.
    initCors() {
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
    }
    // setup routes for the express server
    buildRoutes() {
        const apiRouter = express_1.default.Router();
        this.app.use("/api", apiRouter);
        apiRouter.use("/artist", new artist_1.ArtistRouter().getRouter());
        apiRouter.use("/album", new album_1.AlbumRouter().getRouter());
        apiRouter.use("/playlist", new playlist_1.PlaylistRouter().getRouter());
        apiRouter.use("/song", new song_1.SongRouter().getRouter());
        apiRouter.use("/user", new user_1.UserRouter().getRouter());
    }
    // initializes connection to mongo database
    initDatabase() {
        mongoose_1.default.Promise = global.Promise;
        mongoose_1.default.connect("mongodb://localhost:27017/SpotifyClone", { useNewUrlParser: true });
    }
}
new Application().start();
//# sourceMappingURL=server.js.map