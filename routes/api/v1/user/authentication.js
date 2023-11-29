const express = require("express");
const passport = require("passport");
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

authenticationRouter.post(
  "/send-otp",
  passport.authenticate("user", { session: false }),
  authenticationController.sendOtp
);

// ? resend otp
authenticationRouter.post(
  "/resend-otp",
  passport.authenticate("user", { session: false }),
  authenticationController.sendOtp
);

// ? verify-otp
authenticationRouter.post(
  "/otp-varification",
  passport.authenticate("user", { session: false }),
  authenticationController.verifyOtp
);

// ? logout
authenticationRouter.post("/sign-out", authenticationController.logout);

module.exports = authenticationRouter;
