const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Event Name is Required"],
      unique: true,
    },
    eventFees: {
      type: Number,
      required: true,
    },
    maxMembers: {
      type: String,
      required: [true, "Memebers are Required"],
    },
    isGirlMendatory: {
      type: Boolean,
      required: true,
    },
    numberOfGirls: {
      type: Number,
      default: 0,
    },
    facultyNames: [
      {
        type: String,
        required: true,
      },
    ],
    eventDate: {
      type: String,
      required: true,
    },
    eventStartTime: {
      type: String,
      required: true,
    },
    eventEndTime: {
      type: String,
      required: true,
    },
    vanue: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Events", eventSchema);

module.exports = Event;
