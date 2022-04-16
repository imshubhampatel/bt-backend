const SuperAdmin = require("../../models/admins/super-admin.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
  const { name, userName, password, email, contact } = req.body;
  if (!name || !userName || !password || !email || !contact) {
    let emptyFields = {};
    for (let field in req.body) {
      if (req.body[field]) continue;
      emptyFields[field] = `${field} is required`;
    }
    return res.status(404).json({
      sucess: false,
      data: { message: "fields fill missing fileds", errors: emptyFields },
    });
  }

  let superAdmin = await SuperAdmin.findOne({ email });
  if (superAdmin)
    return res
      .status(409)
      .json({ sucess: false, data: { message: "Admin Already Exits" } });

  try {
    console.log("hey");
    let encry_password = await bcrypt.hashSync(password, 10);
    console.log("hey");
    let superAdmin = await SuperAdmin.create({
      name,
      userName,
      encry_password,
      email,
      contact,
    });
    console.log(superAdmin);
    return res.status(201).json({
      sucess: true,
      data: { message: "super admin registered" },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      data: { message: "Internal server error", error: error.response.data },
    });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    let emptyFields = {};
    for (let field in req.body) {
      if (req.body[field]) continue;
      emptyFields[field] = `${field} is required`;
    }
    return res.status(404).json({
      sucess: false,
      data: { message: "fields fill missing fileds", errors: emptyFields },
    });
  }

  try {
    //? finding superadmin
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(404).json({
        sucess: false,
        data: { message: "Please register superadmin first" },
      });
    }
    //? password validation
    let isMatch = await bcrypt.compare(password, superAdmin.encry_password);
    if (!isMatch) {
      return res.status(403).json({
        sucess: false,
        data: { message: "Incorrect Password" },
      });
    }
    //? genrating token
    let accessToken = jwt.sign(
      { _id: superAdmin._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    let refreshToken = jwt.sign(
      { _id: superAdmin._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      path: "/api/v1/super-admin/refresh-token",
    });

    return res.status(200).json({
      sucess: true,
      data: { message: "login successfully", token: accessToken },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ sucess: false, data: { message: "Internal server error" } });
  }
};
