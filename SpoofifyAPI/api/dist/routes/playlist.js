"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// router for playlist
const express_1 = __importDefault(require("express"));
const playlist_1 = require("../controllers/playlist");
class PlaylistRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new playlist_1.PlaylistController();
    }
    // Creates the routes for this router and returns a populated router object
    getRouter() {
        this.router.get("/", this.controller.getPlaylists);
        this.router.get("/user/:userID", this.controller.getPlaylistByUser);
        this.router.get("/:id", this.controller.getPlaylist);
        this.router.post("/", this.controller.createPlaylist);
        this.router.put("/:id", this.controller.updatePlaylist);
        this.router.delete("/:id", this.controller.deletePlaylist);
        return this.router;
    }
}
exports.PlaylistRouter = PlaylistRouter;
//# sourceMappingURL=playlist.js.map