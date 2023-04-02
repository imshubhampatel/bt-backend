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
module.exports.getUserByUniqueCode = async (req, res) => {
  try {
    let user = User.findOne({ uniqueCode: req.query.uniqueCode });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
      message: "Internal server error",
    });
  }
};
