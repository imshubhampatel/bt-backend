const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required for User"],
      trim: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required for User"],
      trim: true,
      lowercase: true,
    },
    enrollmentNumber: {
      type: String,
      unique: true,
      required: [true, "Enrollment number is required for User"],
    },
    contactNumber: {
      type: Number,
      trim: true,
      unique: true,
      validate: /^$|^\d{10}$/,
      required: [true, "Contact number is required for User"],
    },
    branch: {
      type: String,
      required: [true, "Branch is required for User"],
    },
    address: {
      type: String,
      required: [true, "Address is required for User"],
    },

    subject: {
      type: String,
    },
    semester: {
      type: String,
      required: [true, "Semester is required for User"],
    },
    uniqueCode: {
      type: String,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ["FAILED", "REJECTED", "PENDING", "COMPLETED"],
      default: "PENDING",
    },
    status: {
      type: String,
      enum: ["PENDING", "RESOLVED", "REJECTED"],
      default: "PENDING",
    },
    paymentDetails: {
      type: Object,
    },
    encry_password: {
      type: String,
      trim: true,
      required: [true, "Password is Required for User"],
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
