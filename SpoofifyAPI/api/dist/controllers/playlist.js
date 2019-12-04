"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const playlist_1 = require("../models/playlist");
const Playlist = mongoose_1.default.model("Playlist", playlist_1.PlaylistSchema);
class PlaylistController {
    getPlaylists(req, res) {
        Playlist.find({}, (err, playlist) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(playlist);
            }
        });
    }
    getPlaylistByUser(req, res) {
        Playlist.find({ creator: req.params.userID }, (err, playlist) => {
            if (err) {
                res.send(err);
            }
            else if (playlist) {
                res.send(playlist);
            }
            else {
                res.send({ message: "could not find playlists for given user" });
            }
        });
    }
    getPlaylist(req, res) {
        Playlist.findById(req.params.id, (err, playlist) => {
            if (err) {
                res.send(err);
            }
            else if (playlist) {
                res.send(playlist);
            }
            else {
                res.send("playlist not found");
            }
        });
    }
    createPlaylist(req, res) {
        const playlist = new Playlist(req.body);
        playlist.save((err, body) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(body);
            }
        });
    }
    updatePlaylist(req, res) {
        Playlist.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(updated);
            }
        });
    }
    deletePlaylist(req, res) {
        Playlist.findByIdAndRemove(req.params.id, (err, removed) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(removed);
            }
        });
    }
}
exports.PlaylistController = PlaylistController;
//# sourceMappingURL=playlist.js.map