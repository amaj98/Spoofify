"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.ArtistSchema = new Schema({
    followers: { type: Number },
    name: { type: String, required: "artist name" },
    spotify: { type: String, required: "Spotify Link" },
    summary: { type: String } // short description of artist
});
//# sourceMappingURL=artist.js.map