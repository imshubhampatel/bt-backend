const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("Hey its fine");
});

router.use("/user", require("./user"));
router.use("/admin", require("./admin"));
router.use("/sub-admin", require("./sub-admin"));
router.use("/super-admin", require("./super-admin"));

module.exports = router;
