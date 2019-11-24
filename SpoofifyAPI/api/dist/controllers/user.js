"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const User = user_1.UserModel;
const secret = "supersecretspystuff";
class UserController {
    getUsers(req, res) {
        User.find({}, (err, user) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(user);
            }
        });
    }
    getUser(req, res) {
        User.findById(req.params.id, (err, user) => {
            if (err) {
                res.send(err);
            }
            else if (user) {
                res.send(user);
            }
            else {
                res.send({ message: "user not found" });
            }
        });
    }
    createUser(req, res) {
        const user = new User(req.body);
        user.save((err, body) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(body);
            }
        });
    }
    updateUser(req, res) {
        User.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(updated);
            }
        });
    }
    deleteUser(req, res) {
        User.findByIdAndRemove(req.params.id, (err, removed) => {
            if (err) {
                res.send(err);
            }
            else {
                res.send(removed);
            }
        });
    }
    postLogin(req, res) {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                return res.send(err);
            }
            if (!user) {
                return res.send({ message: "no user found for given email" });
            }
            user.comparePassword(req.body.password, (cmperr, isMatch) => {
                if (cmperr) {
                    return res.send(cmperr);
                }
                else if (isMatch) {
                    return res.send({ token: jsonwebtoken_1.default.sign(user.toJSON(), secret), user });
                }
                return res.send({ message: "incorrect password" });
            });
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map