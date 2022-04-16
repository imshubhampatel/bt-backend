const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
// SA = super admin
const SAcontroller = require("../../../../controllers/admin/super.admincontroller");

router.post("/sign-up", SAcontroller.signUp);
router.post("/sign-in", SAcontroller.signIn);

module.exports = router;
