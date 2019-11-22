import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const UserSchema = new Schema(
    {
        email: { type: String, required: "email", unique: true },
        info: { firstName: { type: String }, lastName: { type: String }, age: { type: Number } },
        password: { type: String, required: "password" },
        user: { type: String, required: "user name", unique: true }
    }
);

export interface IUser extends mongoose.Document {
    email: string;
    info: { firstName: string, lastName: string, age: number };
    password: string;
    user: string;
    comparePassword(password: string, callback: (err: string, isMatch: boolean) => void): boolean;
}

UserSchema.pre("save", function(next) {
    const user = this as IUser;
    if (!this.isModified("password")) { return next(); }
    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) { return next(error); }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword =
    function(candidatePassword: string, callback: (err: Error, isMatch: boolean) => void) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => callback(err, isMatch));
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
