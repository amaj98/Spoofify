import express from "express";
import mongoose from "mongoose";
import { ArtistSchema } from "../models/artist";

const Artist = mongoose.model("Artist", ArtistSchema);
export class ArtistController {

    public getArtists(req: express.Request, res: express.Response): void {
        Artist.find({}, (err, artist) => {
            if (err) { res.send(err); } else { res.send(artist); }
        });
    }
    public getArtist(req: express.Request, res: express.Response): void {
        Artist.findById(req.params.id, (err, artist) => {
            if (err) { res.send(err); } else if (artist) { res.send(artist); } else { res.send("artist not found"); }
        });
    }
    public createArtist(req: express.Request, res: express.Response): void {
        const artist = new Artist(req.body);
        artist.save((err, body) => {
            if (err) { res.send(err); } else { res.send(body); }
        });
    }
    public updateArtist(req: express.Request, res: express.Response): void {
        Artist.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
            if (err) { res.send(err); } else { res.send(updated); }
        });
    }
    public deleteArtist(req: express.Request, res: express.Response): void {
        Artist.findByIdAndRemove(req.params.id, (err, removed) => {
            if (err) { res.send(err); } else { res.send(removed); }
        });
    }
}
