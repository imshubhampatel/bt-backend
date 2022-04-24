const express = require("express");
const superAdminRouter = express.Router();
const passport = require("passport");
// SA = super admin
const superAdmincontroller = require("../../../../controllers/super-admin/add_admin.controller");

superAdminRouter.post(
  "/add-admin",
  passport.authenticate("super-admin", { session: false }),
  superAdmincontroller.addAdmin
);

module.exports = superAdminRouter;
