// album router
import express from "express";
import {AlbumController} from "../controllers/album";

export class AlbumRouter {
    private router: express.Router = express.Router();
    private controller: AlbumController = new AlbumController();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.get("artist/:artist", this.controller.getAlbumsByArtist);
        this.router.get("/", this.controller.getAlbums);
        this.router.get("/:id", this.controller.getAlbum);
        this.router.post("/", this.controller.createAlbum);
        this.router.put("/:id", this.controller.updateAlbum);
        this.router.delete("/:id", this.controller.deleteAlbum);
        return this.router;
    }
}
