const SuperAdmin = require("../../models/admins/super-admin.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMessage } = require("../../methods/sendMessage");

// Function to generate OTP
function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

module.exports.adminInfo = async (req, res) => {
  return res
    .status(200)
    .json({ success: true, data: { superAdmin: req.user } });
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
    superAdmin.otp = generateOTP();
    await superAdmin.save();
    let accessToken = jwt.sign(
      { _id: superAdmin._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    let sendMail = sendMessage(
      email,
      "this is otp varification",
      `<h3>OTP for account verification is </h3> <h1 style='font-weight:bold;'>${generateOTP()} </h1>`
    );
    return res.status(201).json({
      sucess: true,
      data: { message: "super admin registered", token: accessToken },
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
    console.log(error.message);
    return res
      .status(500)
      .json({ sucess: false, data: { message: "Internal server error" } });
  }
};

// send otp

module.exports.sendOtp = async (req, res) => {
  console.log(req.user);
  try {
    //generating otp
    let otp = generateOTP();
    let newAdmin = await SuperAdmin.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { otp, varifiedOtp: "pending" } },
      { new: true }
    );
    console.log(newAdmin);

    //? sending mail to otp

    let sendMail = await sendMessage(
      "shubhampatel@appslure.com",
      "this is otp varification",
      `<h1>${otp}</h1>`
    );

    return res.status(200).json({
      sucess: true,
      data: { message: "OTP sent successfully" },
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.verifyOtp = async (req, res) => {
  console.log(req.body);
  await SuperAdmin.findById(req.user._id, async (err, superAdmin) => {
    console.log(superAdmin);
    if (err) console.log(err);
    if (!superAdmin) console.log("superadmin not found");
    if (!(superAdmin.otp === req.body.otp)) {
      return res
        .status(403)
        .json({ success: false, data: { message: "incorrect otp" } });
    }
    if (!superAdmin.varifiedEmail) {
      superAdmin.varifiedEmail = true;
    }
    superAdmin.varifiedOtp = "approved";
    await superAdmin.save();
    return res.status(200).json({
      success: true,
      data: { message: "otp verification successfull" },
    });
  });
};
