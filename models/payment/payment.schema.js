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
    },
    uniqueCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
