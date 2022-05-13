const express = require("express");
const router = express.Router();

router.use("/", require("./events"));

module.exports = router;
