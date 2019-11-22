import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ArtistSchema = new Schema(
    {
        followers: {type: Number}, // number of followers
        name: {type: String, required: "artist name"},
        similarArtists: {type: [String]}, // array of IDs of similar artists
        summary: {type: String} // short description of artist

    }
);
