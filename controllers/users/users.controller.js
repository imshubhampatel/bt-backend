const User = require("../../models/users/user.schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
