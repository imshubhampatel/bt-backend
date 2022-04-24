const express = require("express");
const superAdminRouter = express.Router();
const { check } = require("express-validator");
const passport = require("passport");
// SA = super admin
const superAdmincontroller = require("../../../../controllers/super-admin/super.admin.controller");

//sign-up
superAdminRouter.post("/sign-up", superAdmincontroller.signUp);

//sign-in
superAdminRouter.post("/sign-in", superAdmincontroller.signIn);

//? send otp
superAdminRouter.post(
  "/send-otp",
  passport.authenticate("super-admin", { session: false }),
  superAdmincontroller.sendOtp
);

//? resend otp
superAdminRouter.post(
  "/resend-otp",
  passport.authenticate("super-admin", { session: false }),
  superAdmincontroller.sendOtp
);

//varify-otp
superAdminRouter.post(
  "/otp-varification",
  passport.authenticate("super-admin", { session: false }),
  superAdmincontroller.verifyOtp
);
superAdminRouter.get(
  "/details",
  passport.authenticate("super-admin", { session: false }),
  superAdmincontroller.adminInfo
);

module.exports = superAdminRouter;
