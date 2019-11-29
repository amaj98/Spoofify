"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// playlist model
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.PlaylistSchema = new Schema({
    creator: { type: String, required: "ID of user who created playlist" },
    followers: { type: Number, required: "number of followers" },
    songs: { type: [String] },
    title: { type: String, required: "playlist title" }
});
//# sourceMappingURL=playlist.js.map