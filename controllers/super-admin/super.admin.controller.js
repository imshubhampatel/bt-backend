const SuperAdmin = require("../../models/admins/super-admin.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMessage } = require("../../services/nodemailer/sendMessage");

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
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refresh-token", refreshToken, {
      sameSite: "strict",
      path: "/api/v1/super-admin/refresh-token",
      httpOnly: true,
      secure: true,
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
  console.log("iser", req.user);
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
    console.log("sendMail");

    let sendMail = await sendMessage(
      "shubhampatel@appslure.com",
      "[BTIRT] Please verify your login",
      `<div
      style="
        font-family: Helvetica, Arial, sans-serif;
        min-width: 1000px;
        overflow: auto;
        line-height: 2;
      "
    >
      <div style="margin: 50px auto; width: 70%; padding: 20px 0">
        <div style="border-bottom: 1px solid #eee">
          <a
            href=""
            style="
              font-size: 1.4em;
              color: #e52b50;
              text-decoration: none;
              font-weight: 600;
            "
            >Babulal tarabai institute of research and technology</a
          >
        </div>
        <p style="font-size: 1.1em">Hey ${newAdmin.name},</p>
        <p>
          Thank you for login  Btirt Dashboard. Use the following OTP to complete your
          Sign-in procedures. OTP is valid for 5 minutes.
        </p>
        <h2
          style="
            background: #e52b50;
            margin: 0 auto;
            width: max-content;
            padding: 0 10px;
            color: #fff;
            border-radius: 4px;
          "
        >
          ${otp}
        </h2>
        <p style="font-size: 0.9em">Regards,<br />Your Brand</p>
        <hr style="border: none; border-top: 1px solid #eee" />
        <div
          style="
            float: right;
            padding: 8px 0;
            color: #aaa;
            font-size: 0.8em;
            line-height: 1;
            font-weight: 300;
          "
        >
          <p>Your BTRIT Inc</p>
          <p> Sironja, Sagar</p>
          <p>Madhya Pradesh, India</p>
        </div>
      </div>
    </div>
    `
    );
    console.log("sendMail", sendMail);
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

  try {
    let superAdmin = await SuperAdmin.findById(req.user._id);
    if (superAdmin.otp !== req.body.otp) {
      return res
        .status(403)
        .json({ success: false, data: { message: "incorrect otp" } });
    }

    //? approved
    superAdmin.varifiedOtp = "approved";
    superAdmin.save();
    return res.status(200).json({
      success: true,
      data: { message: "Otp Verification was successfull" },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, data: { message: "Internal server error" } });
  }
};

module.exports.refreshToken = async (req, res) => {
  try {
    const rf_Token = await req.cookies["refresh-token"];
    if (!rf_Token) {
      return res.status(401).json({
        data: { success: false, message: "Please Login or Sign Up first" },
      });
    }
    if (rf_Token) {
      jwt.verify(
        rf_Token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) {
            return res.status(401).json({
              success: false,
              data: {
                message: "Error Please Login or Sign Up first",
              },
            });
          }
          if (user) {
            const accessToken = await jwt.sign(
              { _id: user._id },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1d" }
            );
            return res.status(200).json({
              success: true,
              data: {
                message: "data fetched",
                token: accessToken,
              },
            });
          }
        }
      );
    }
  } catch (error) {
    return res.status(404).send(error);
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("refresh-token", {
      path: "/api/v1/super-admin/refresh-token",
    });

    return res
      .status(200)
      .json({ sucess: true, data: { message: "Logged out successfully" } });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      data: { message: "Internal server error", error: error.message },
    });
  }
};
