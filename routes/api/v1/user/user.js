const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("router");
});

module.exports = router;
