import express from "express";
import mongoose from "mongoose";
import { AlbumSchema } from "../models/album";
import { ArtistSchema } from "../models/artist";
import { SongSchema } from "../models/song";

const Song = mongoose.model("Song", SongSchema);
const Artist = mongoose.model("Artist", ArtistSchema);
const Album = mongoose.model("Album", AlbumSchema);
export class SongController {

    public getSongs(req: express.Request, res: express.Response): void {
        Song.find({}, (err, songs) => {
            if (err) { res.send(err); } else if (songs) { res.send(songs); }
        });
    }
    public getSongsByArtist(req: express.Request, res: express.Response): void {
        Song.find({artist: req.params.artist}, (err, songs) => {
            if (err) { res.send(err); } else if (songs) { res.send(songs); } else { res.send("could not find songs for given artist"); }
        });
    }
    public getSongsByAlbum(req: express.Request, res: express.Response): void {
        Song.find({album: req.params.album}, (err, songs) => {
            if (err) { res.send(err); } else if (songs) { res.send(songs); } else { res.send("could not find songs for given album"); }
        });
    }
    public getSong(req: express.Request, res: express.Response): void {
        Song.findById(req.params.id, (err, song) => {
            if (err) { res.send(err); } else if (song) { res.send(song); } else { res.send("song not found"); }
        });
    }
    public createSong(req: express.Request, res: express.Response): void {
        const song = new Song(req.body);
        Artist.findById(req.body.artist, (err, artist) => {
            if (err) { res.send(err); } else if (artist) {
                song.save((saveErr, body) => {
                    if (saveErr) { res.send(saveErr); } else { res.send(body); }
                });
            } else { res.send("could not save song because artist not found"); }
        });
    }
    public updateSong(req: express.Request, res: express.Response): void {
        Song.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
            if (err) { res.send(err); } else { res.send(updated); }
        });
    }
    public deleteSong(req: express.Request, res: express.Response): void {
        Song.findByIdAndRemove(req.params.id, (err, removed) => {
            if (err) { res.send(err); } else { res.send(removed); }
        });
    }
}
