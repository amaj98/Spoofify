import express from "express";
import {SongController} from "../controllers/song";

export class SongRouter {
    private router: express.Router = express.Router();
    private controller: SongController = new SongController();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.get("/artist/:artist", this.controller.getSongsByArtist);
        this.router.get("/album/:album", this.controller.getSongsByAlbum);
        this.router.get("/:id", this.controller.getSong);
        this.router.get("/", this.controller.getSongs);
        this.router.post("/", this.controller.createSong);
        this.router.put("/:id", this.controller.updateSong);
        this.router.delete("/:id", this.controller.deleteSong);
        return this.router;
    }
}
