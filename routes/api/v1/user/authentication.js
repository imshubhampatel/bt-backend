const express = require("express");
const authenticationController = require("../../../../controllers/users/authentication.controller");
const authenticationRouter = express.Router();

//? sign up

authenticationRouter.post("/sign-up", authenticationController.signUp);

//? sign in
authenticationRouter.post("/sign-in", authenticationController.signIn);

// ? get refreshToken
authenticationRouter.get(
  "/refresh-token",
  authenticationController.refreshToken
);

// ? logout
authenticationRouter.post("/sign-out", authenticationController.logout);

module.exports = authenticationRouter;
