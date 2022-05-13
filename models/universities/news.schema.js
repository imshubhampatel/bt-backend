const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isRecent: {
      type: String,
      default: true,
    },
    headline: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    isApproved: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperAdmin",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAdmin",
    },
    allImages: [{ type: String }],
    newsImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", newsSchema);
module.exports = News;
