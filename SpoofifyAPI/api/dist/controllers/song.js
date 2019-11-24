"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const album_1 = require("../models/album");
const artist_1 = require("../models/artist");
const song_1 = require("../models/song");
const Song = mongoose_1.default.model("Song", song_1.SongSchema);
const Artist = mongoose_1.default.model("Artist", artist_1.ArtistSchema);
const Album = mongoose_1.default.model("Album", album_1.AlbumSchema);
class SongController {
    getSongs(req, res) {
        Song.find({}, (err, songs) => {
            if (err) {
                res.send(err);
            }
            else if (songs) {
                res.send(songs);
            }
        });
    }
    getSongsByArtist(req, res) {
        Song.find({ artist: req.params.artist }, (err, songs) => {
            if (err) {
                res.send(err);
            }
            else if (songs) {
                res.send(songs);
            }
            else {
                res.send("could not find songs for given artist");
            }
        });
    }
    getSongsByAlbum(req, res) {
        Song.find({ album: req.params.album }, (err, songs) => {
            if (err) {
                res.send(err);
            }
            else if (songs) {
                res.send(songs);
            }
            else {
                res.send("could not find songs for given album");
            }
        });
    }
    getSong(req, res) {
        Song.findById(req.params.id, (err, song) => {
            if (err) {
                res.send(err);
            }
            else if (song) {
                res.send(song);
            }
            else {
                res.send("song not found");
            }
        });
    }
    createSong(req, res) {
        const song = new Song(req.body);
        Artist.findById(req.body.artist, (err, artist) => {
            if (err) {
                res.send(err);
            }
            else if (artist) {
                song.save((saveErr, body) => {
                    if (saveErr) {
                        res.send(saveErr);
                    }
                    else {
                        res.send(body);
                    }
                });
            }
            else {
                res.send("could not save song because artist not found");
            }
        });
    }
    updateSong(req, res) {
        Song.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(updated);
            }
        });
    }
    deleteSong(req, res) {
        Song.findByIdAndRemove(req.params.id, (err, removed) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(removed);
            }
        });
    }
}
exports.SongController = SongController;
//# sourceMappingURL=song.js.map