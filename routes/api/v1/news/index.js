const express = require("express");
const passport = require("passport");
const router = express.Router();

router.use(
  "/",
  // passport.authenticate("super-admin", { session: false }),
  require("./news.js")
);

module.exports = router;
