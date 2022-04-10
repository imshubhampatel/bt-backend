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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    otp: {
      type: Number,
      default: "",
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
    contact: {
      type: Number,
      required: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    accountStatus: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);
module.exports = SuperAdmin;
