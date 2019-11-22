import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const SongSchema = new Schema(
    {
        album: {type: String}, // ID of album if on an album
        artist: {type: String, required: "ID of artist"},
        duration: {type: Number, required: "song length in seconds"},
        features: {type: [String]}, // List of IDs of artists who are featured on song
        plays: {type: Number, required: "number of plays"},
        title: {type: String, required: "song title"}
    }
);
