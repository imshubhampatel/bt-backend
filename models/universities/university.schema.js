const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },

  principal: {
    type: String,
    required: true,
  },

  universityAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },

  contactNumber1: {
    type: Number,
  },

  contactNumber2: {
    type: Number,
  },

  state: {
    type: String,
  },

  district: {
    type: String,
  },

  city: {
    type: String,
  },

  address: {
    type: String,
  },

  pinCode: {
    type: Number,
  },

  logo: {
    type: String,
    default: "",
  },

  // ? Referrence from Sport
  sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],

  // ? Referrence from Coach
  coaches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coach" }],

  // ? Referrence from Team
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],

  // ?
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],

  // ? Referrence from Player
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // ? Referrence from Event
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = mongoose.model("University", universitySchema);
