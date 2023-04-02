const User = require("../../models/users/user.schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
      path: "/api/v1/users/refresh-token",
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
