"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.SongSchema = new Schema({
    album: { type: String },
    artist: { type: String, required: "ID of artist" },
    duration: { type: Number, required: "song length in seconds" },
    features: { type: [String] },
    plays: { type: Number, required: "number of plays" },
    spotify: { type: String, required: "Spotify Link" },
    title: { type: String, required: "song title" }
});
//# sourceMappingURL=song.js.map