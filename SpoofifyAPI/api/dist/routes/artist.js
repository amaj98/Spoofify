"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const artist_1 = require("../controllers/artist");
class ArtistRouter {
    constructor() {
        this.router = express_1.default.Router();
        this.controller = new artist_1.ArtistController();
    }
    // Creates the routes for this router and returns a populated router object
    getRouter() {
        this.router.get("/", this.controller.getArtists);
        this.router.get("/:id", this.controller.getArtist);
        this.router.post("/", this.controller.createArtist);
        this.router.put("/:id", this.controller.updateArtist);
        this.router.delete("/:id", this.controller.deleteArtist);
        return this.router;
    }
}
exports.ArtistRouter = ArtistRouter;
//# sourceMappingURL=artist.js.map