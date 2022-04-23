const mongoose = require("mongoose");

const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,

      required: true,
      unique: true,
      lowercase: true,
    },
    otp: {
      type: String,
      default: "000000",
    },
    varifiedOtp: {
      type: String,
      default: "pending",
      enum: ["pending", "approved"],
    },
    encry_password: {
      type: String,
      required: true,
    },
    isLogin: {
      type: Boolean,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    accountStatus: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],
    subAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubAdmin",
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "onModel",
      },
    ],
    onModel: {
      type: String,
      enum: ["SubAdmin", "Admin", "User"],
    },
  },
  {
    timestamps: true,
  }
);

//function to set lastLogin
superAdminSchema.statics.newLogin = function login(id, callback) {
  // ?
  return this.findByIdAndUpdate(
    id,
    { $set: { lastLogin: Date.now() } },
    { new: true },
    callback
  );
};

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);
module.exports = SuperAdmin;
