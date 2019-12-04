// playlist controller
import express from "express";
import mongoose from "mongoose";
import { PlaylistSchema } from "../models/playlist";
import { UserSchema } from "../models/user";

const Playlist = mongoose.model("Playlist", PlaylistSchema);
export class PlaylistController {

    public getPlaylists(req: express.Request, res: express.Response): void {
        Playlist.find({}, (err, playlist) => {
            if (err) { res.send(err); } else { res.send(playlist); }
        });
    }
    public getPlaylistByUser(req: express.Request, res: express.Response): void {
        Playlist.find({creator: req.params.userID}, (err, playlist) => {
            if (err) { res.send(err); } else if (playlist) { res.send(playlist); } else { res.send({message: "could not find playlists for given user"}); }
        });
    }
    public getPlaylist(req: express.Request, res: express.Response): void {
        Playlist.findById(req.params.id, (err, playlist) => {
            if (err) {
                res.send(err);
            } else if (playlist) {
                res.send(playlist);
            } else {
                res.send("playlist not found");
            }
        });
    }
    public createPlaylist(req: express.Request, res: express.Response): void {
        const playlist = new Playlist(req.body);
        playlist.save((err, body) => {
            if (err) { res.send(err); } else { res.send(body); }
        });
    }
    public updatePlaylist(req: express.Request, res: express.Response): void {
        Playlist.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
            if (err) { res.send(err); } else { res.send(updated); }
        });
    }
    public deletePlaylist(req: express.Request, res: express.Response): void {
        Playlist.findByIdAndRemove(req.params.id, (err, removed) => {
            if (err) { res.send(err); } else { res.send(removed); }
        });
    }
}
