const bcrypt = require("bcryptjs");
const SuperAdmin = require("../../models/admins/super-admin.schema");
const Admin = require("../../models/admins/admin.schema");
const { sendMessage } = require("../../services/nodemailer/sendMessage");

function generatePassword(name = "shubham") {
  let str = name.split("");
  var digits = "0123456789";
  let lastDigit = "";
  for (let i = 0; i < 5; i++) {
    lastDigit += digits[Math.floor(Math.random() * 10)];
  }
  str = `${str[0].toUpperCase()}${str[1]}${str[2]}${str[3]}${lastDigit}`;
  console.log(str);
  return str;
}

module.exports.addAdmin = async (req, res) => {
  try {
    let superAdmin = await SuperAdmin.findOne({ _id: req.user._id });
    if (!superAdmin) console.log("cannot find superadmin");
    let password = generatePassword();
    let encry_password = bcrypt.hashSync(password, 10);
    let admin = await Admin.create({
      ...req.body,
      encry_password,
    });
    superAdmin.admin = [...superAdmin.admin, admin];
    superAdmin.save();

    //? sending mail to otp

    let sendMail = await sendMessage(
      "shubhampatel@appslure.com",
      "Your Password for Login BTIRT COLLEGE MANAGEMENT SYSTEM",
      `<h1>${password}</h1>`
    );
    return res
      .status(201)
      .json({ success: true, data: { message: "Admin added successfully" } });
  } catch (error) {
    console.log(error.message);
  }
};
