const express = require("express");
const router = express.Router();

router.use("/", require("./super_admin"));
// router.use("/:superAdminId/admins", require("./add_admin"));

module.exports = router;
