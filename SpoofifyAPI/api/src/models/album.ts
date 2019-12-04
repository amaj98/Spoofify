// album model
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const AlbumSchema = new Schema(
    {
        artist: {type: String, required: "ID of artist"},
        genre: {type: String},
        spotify: {type: String, required: "Spotify Link"},
        title: {type: String, required: "album title"}
    }
);
