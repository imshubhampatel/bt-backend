const express = require("express");
const router = express.Router();

router.use("/", require("./user"));
router.use("/authentication", require("./authentication"));

module.exports = router;
