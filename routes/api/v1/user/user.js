const express = require("express");
const passport = require("passport");
const userController = require("../../../../controllers/users/users.controller");
const userRouter = express.Router();

userRouter.get(
  "/get-user",
  passport.authenticate("user", { session: false }),
  userController.getUserById
);

module.exports = userRouter;
