const SuperAdmin = require("../../models/admins/super-admin.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMessage } = require("../../methods/sendMessage");

module.exports.adminInfo = (req, res) => {
  console.log(req.user);
  return res.status(200).json({ success: true, data: { admin: "me" } });
};

module.exports.verifyOtp = (req, res) => {
  console.log(req.body);
  return res.status(200).json({ success: true, data: { admin: "me" } });
};

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
    let encry_password = await bcrypt.hashSync(password, 10);
    let superAdmin = await SuperAdmin.create({
      name,
      userName,
      encry_password,
      email,
      contact,
    });
    console.log(superAdmin);
    superAdmin.otp = 967764;
    await superAdmin.save();
    console.log(superAdmin);
    let sendMail = sendMessage(
      email,
      "this is otp varification",
      `<h3>OTP for account verification is </h3> <h1 style='font-weight:bold;'> 102903 </h1>`
    );
    if (sendMail && sendMail) {
      console.log("yep");
    }
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
    console.log("hey");

    let sendMail = await sendMessage(
      "shubhampatel@appslure.com",
      "this is otp varification",
      `<h1>903493</h1>`
    );

    if (sendMail && sendMail) {
      console.log("yep");
    }
    return res.status(200).json({
      sucess: true,
      data: { message: "login successfully", token: accessToken },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ sucess: false, data: { message: "Internal server error" } });
  }
};
