const express = require("express");
const userController = require("../../../../controllers/users/users.controller");
const userRouter = express.Router();

userRouter.post("/sign-up", userController.signUp);
userRouter.post("/sign-in", userController.signIn);

module.exports = userRouter;
