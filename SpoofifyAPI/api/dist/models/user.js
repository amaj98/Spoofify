"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.UserSchema = new Schema({
    email: { type: String, required: "email", unique: true },
    info: { firstName: { type: String }, lastName: { type: String }, age: { type: Number } },
    password: { type: String, required: "password" },
    saved_albums: [String],
    saved_artists: [String],
    saved_playlists: [String],
    saved_songs: [String],
    user: { type: String, required: "user name", unique: true },
});
exports.UserSchema.pre("save", function (next) {
    const user = this;
    if (!this.isModified("password")) {
        return next();
    }
    bcryptjs_1.default.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcryptjs_1.default.hash(user.password, salt, (error, hash) => {
            if (error) {
                return next(error);
            }
            user.password = hash;
            next();
        });
    });
});
exports.UserSchema.methods.comparePassword =
    function (candidatePassword, callback) {
        bcryptjs_1.default.compare(candidatePassword, this.password, (err, isMatch) => callback(err, isMatch));
    };
exports.UserModel = mongoose_1.default.model("User", exports.UserSchema);
//# sourceMappingURL=user.js.map