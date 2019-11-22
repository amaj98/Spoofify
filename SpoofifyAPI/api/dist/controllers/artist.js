"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const artist_1 = require("../models/artist");
const Artist = mongoose_1.default.model("Artist", artist_1.ArtistSchema);
class ArtistController {
    getArtists(req, res) {
        Artist.find({}, (err, artist) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(artist);
            }
        });
    }
    getArtist(req, res) {
        Artist.findById(req.params.id, (err, artist) => {
            if (err) {
                res.send(err);
            }
            else if (artist) {
                res.send(artist);
            }
            else {
                res.send("artist not found");
            }
        });
    }
    createArtist(req, res) {
        const artist = new Artist(req.body);
        artist.save((err, body) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(body);
            }
        });
    }
    updateArtist(req, res) {
        Artist.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(updated);
            }
        });
    }
    deleteArtist(req, res) {
        Artist.findByIdAndRemove(req.params.id, (err, removed) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(removed);
            }
        });
    }
}
exports.ArtistController = ArtistController;
//# sourceMappingURL=artist.js.map