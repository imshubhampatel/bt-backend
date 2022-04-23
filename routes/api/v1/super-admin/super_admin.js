const express = require("express");
const superAdminRouter = express.Router();
const { check } = require("express-validator");
const passport = require("passport");
// SA = super admin
const SAcontroller = require("../../../../controllers/admin/super.admincontroller");

superAdminRouter.post("/sign-up", SAcontroller.signUp);
superAdminRouter.post("/sign-in", SAcontroller.signIn);
superAdminRouter.get(
  "/details",
  passport.authenticate("super-admin", { session: false }),
  SAcontroller.adminInfo
);

superAdminRouter.post(
  "/:adminId/otp-varification",
  passport.authenticate("super-admin", { session: false }),
  SAcontroller.verifyOtp
);

module.exports = superAdminRouter;
