const express = require("express");
const router = express.Router();

router.use("/", require("./user"));
router.use("/authentication", require("./authentication"));
router.use("/events", require("./events"));
router.use("/razorpay", require("./payment"));

module.exports = router;
