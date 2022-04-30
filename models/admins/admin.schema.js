const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
    },
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
    },
    education: {
      Schooling: {
        "10th": {
          schoolName: {
            type: String,
          },
          marks: {
            type: Number,
            trim: true,
          },
          marksheet: {
            type: String,
          },
          board: {
            type: String,
          },
        },
        "12th": {
          schoolName: {
            type: String,
          },
          marks: {
            type: Number,
            trim: true,
          },
          marksheet: {
            type: String,
          },
          board: {
            type: String,
          },
        },
      },
      graduation: {
        collgeName: {
          type: String,
        },
        collegeCode: {
          type: Number,
          trim: true,
        },
        degree: {
          type: String,
        },
        marksheet: {
          type: String,
        },
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    varifiedEmail: {
      type: Boolean,
      default: false,
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
    aboutAdmin: {
      contact: {
        type: Number,
        trim: true,
      },
      profileImageUrl: {
        type: String,
        default: "",
      },
      age: {
        type: Number,
        trim: true,
      },
      hobbies: {
        type: Array,
      },
      address: {
        type: String,
        default: "",
      },
      pincode: {
        type: Number,
        trim: true,
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
    },
    encry_password: {
      type: String,
      required: true,
    },
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
        ref: "Task",
        refPath: "onModel",
      },
    ],
    onModel: {
      type: String,
      enum: ["subAdmin", "User"],
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
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

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
