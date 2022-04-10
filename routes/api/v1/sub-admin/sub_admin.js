const express = require("express");
const router = express.Router();

router.use("/", require("./sub_admin"));

module.exports = router;
