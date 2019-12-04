"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// album model
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.AlbumSchema = new Schema({
    artist: { type: String, required: "ID of artist" },
    genre: { type: String },
    spotify: { type: String, required: "Spotify Link" },
    title: { type: String, required: "album title" }
});
//# sourceMappingURL=album.js.map