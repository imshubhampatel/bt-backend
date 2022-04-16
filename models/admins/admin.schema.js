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
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    },
    aboutAdmin: {
      contact: {
        type: Number,
      },
      profileImageUrl: {
        type: String,
        default: "",
      },
      age: {
        type: Number,
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

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);
module.exports = SuperAdmin;
