// router for user
import express from "express";
import {UserController} from "../controllers/user";

export class UserRouter {
    private router: express.Router = express.Router();
    private controller: UserController = new UserController();

    // Creates the routes for this router and returns a populated router object
    public getRouter(): express.Router {
        this.router.get("/", this.controller.getUsers);
        this.router.get("/:id", this.controller.getUser);
        this.router.post("/", this.controller.createUser);
        this.router.post("/login/", this.controller.postLogin);
        this.router.put("/:id", this.controller.updateUser);
        this.router.delete("/:id", this.controller.deleteUser);

        return this.router;
    }
}
