// router for playlist
import express from "express";
import {PlaylistController} from "../controllers/playlist";

export class PlaylistRouter {
    private router: express.Router = express.Router();
    private controller: PlaylistController = new PlaylistController();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.get("/", this.controller.getPlaylists);
        this.router.get("/user/:userID", this.controller.getPlaylistByUser);
        this.router.get("/:id", this.controller.getPlaylist);
        this.router.post("/", this.controller.createPlaylist);
        this.router.put("/:id", this.controller.updatePlaylist);
        this.router.delete("/:id", this.controller.deletePlaylist);

        return this.router;
    }
}
