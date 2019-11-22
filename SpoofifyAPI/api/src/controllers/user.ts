import { NextFunction } from "connect";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import passport from "passport";
import {IVerifyOptions} from "passport-local";
import { runInNewContext } from "vm";
import {IUser, UserModel} from "../models/user";

const User = UserModel;
const secret = "supersecretspystuff";

export class UserController {
    public getUsers(req: express.Request, res: express.Response): void {
        User.find({}, (err, user) => {
            if (err) { res.send(err); } else { res.send(user); }
        });
    }
    public getUser(req: express.Request, res: express.Response): void {
        User.findById(req.params.id, (err, user) => {
            if (err) { res.send(err); } else if (user) { res.send(user); } else { res.send({message: "user not found"}); }
        });
    }
    public createUser(req: express.Request, res: express.Response): void {
        const user = new User(req.body);
        user.save((err, body) => {
            if (err) { res.send(err); } else { res.send(body); }
        });
    }
    public updateUser(req: express.Request, res: express.Response): void {
        User.findByIdAndUpdate(req.params.id, req.body, (err, updated) => {
            if (err) { res.send(err); } else { res.send(updated); }
        });
    }
    public deleteUser(req: express.Request, res: express.Response): void {
        User.findByIdAndRemove(req.params.id, (err, removed) => {
            if (err) { res.send(err); } else { res.send(removed); }
        });
    }
    public postLogin(req: express.Request, res: express.Response): void {
        User.findOne({email: req.body.email}, (err, user) => {
            if (err) { return res.send(err); }
            if (!user) { return res.send({message: "no user found for given email"}); }
            user.comparePassword(req.body.password, (cmperr, isMatch) => {
                if (cmperr) { return res.send(cmperr); } else if (isMatch) {
                    return res.send({token: jwt.sign(user.toJSON(), secret), user});
                }
                return res.send({message: "incorrect password"});
            });
        });
    }
}
