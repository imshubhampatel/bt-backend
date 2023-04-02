const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    txnAmount: {
      type: String,
      required: true,
    },
    txnStatus: {
      type: String,
    },
    txnId: {
      type: String,
      required: true,
      unique: true,
    },
    uniqueCode: {
      type: String,
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    type: {
      type: String,
      default: "REGISTRATION",
      enum: ["REGISTRATION", "EVENT"],
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
