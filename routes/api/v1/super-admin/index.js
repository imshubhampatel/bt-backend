const express = require("express");
const router = express.Router();

router.use("/", require("./super_admin"));

module.exports = router;
