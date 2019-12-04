import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ArtistSchema = new Schema(
    {
        followers: {type: Number}, // number of followers
        name: {type: String, required: "artist name"},
        spotify: {type: String, required: "Spotify Link"},
        summary: {type: String} // short description of artist
    }
);
