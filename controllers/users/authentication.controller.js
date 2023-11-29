const User = require("../../models/users/user.schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendMessage } = require("../../services/nodemailer/sendMessage");
module.exports.signUp = async (req, res) => {
  console.log(req.body);
  try {
    const {
      firstName,
      lastName,
      email,
      enrollmentNumber,
      branch,
      address,
      semester,
      contactNumber,
      password,
    } = req.body;

    console.log(
      /^(?=.*[A-Z!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{8,30}$/.test(password)
    );

    const isUserRegistered = await User.findOne({ email });
    console.log("registed", isUserRegistered);
    if (isUserRegistered !== null) {
      return res.status(403).json({
        success: false,
        message: "User already registered",
      });
    }
    if (password == null || password == "") {
      return res.status(404).json({
        success: false,
        message: "Please enter your password",
      });
    }

    if (
      !/^(?=.*[A-Z!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{8,30}$/.test(password)
    ) {
      return res.status(404).json({
        success: false,
        message: "Please enter valid password",
      });
    }

    let encry_password = await bcrypt.hashSync(password, 10);

    let uniqueCode = Date.now().toString(36);
    console.log({ uniqueCode });
    uniqueCode = `bt-tchfst2k23-${uniqueCode}`;

    const newGrievance = await User.create({
      firstName,
      lastName,
      email,
      branch,
      enrollmentNumber,
      semester,
      address,
      contactNumber,
      uniqueCode,
      encry_password,
    });
    console.log(req.body);

    return res.status(201).json({
      success: true,
      message: "User Registered successfully",
      data: newGrievance,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error,
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
    //? finding user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        sucess: false,
        data: { message: "Please register user first" },
      });
    }
    //? password validation
    let isMatch = await bcrypt.compare(password, user.encry_password);
    if (!isMatch) {
      return res.status(403).json({
        sucess: false,
        data: { message: "Your password is incorrect" },
      });
    }
    //? genrating token
    let accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10M" }
    );
    let refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    `1`;
    res.cookie("refresh-token", refreshToken, {
      sameSite: "strict",
      path: "/api/v1/user/authentication/refresh-token",
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      sucess: true,
      data: {
        message: "login successfully",
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      sucess: false,
      data: { message: "Internal server error", error },
    });
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
                message: "Successfully data fetched",
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
      path: "/api/v1/users/authentication/refresh-token",
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

// Function to generate OTP
function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// send otp

module.exports.sendOtp = async (req, res) => {
  console.log(req.user);
  console.log("iser", req.user);
  try {
    //generating otp
    let otp = generateOTP();
    let newUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { oneTimePassword: otp, isOtpVerified: "PENDING" } },
      { new: true }
    );
    console.log({ newUser });

    //? sending mail to otp
    console.log("sendMail");

    let sendMail = await sendMessage(
      "shubhampatel2024@gmail.com",
      "[BTIRT] Please Verify Your Dashbaord Login",
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
        <p style="font-size: 1.1em">Hey ${newUser.name},</p>
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
  console.log("bpd", req.body);
  console.log(req.user);

  try {
    let user = await User.findById(req.user._id);
    if (user.oneTimePassword !== Number(req.body.otp)) {
      return res
        .status(403)
        .json({ success: false, data: { message: "incorrect otp" } });
    }

    //? approved
    user.isOtpVerified = "APPROVED";
    user.save();
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
