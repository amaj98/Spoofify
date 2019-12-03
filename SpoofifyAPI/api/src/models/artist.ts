import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ArtistSchema = new Schema(
    {
        followers: {type: Number}, // number of followers
        name: {type: String, required: "artist name"},
        summary: {type: String} // short description of artist

    }
);
